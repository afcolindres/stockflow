package com.stockflow.service;

import com.stockflow.dto.MovementRequestDto;
import com.stockflow.dto.MovementResponseDto;
import com.stockflow.dto.PageResponseDto;
import com.stockflow.dto.ProductStatsResponseDto;
import com.stockflow.dto.StockAlertResponseDto;
import com.stockflow.entity.AlertSeverity;
import com.stockflow.entity.Movement;
import com.stockflow.entity.MovementType;
import com.stockflow.entity.Product;
import com.stockflow.exception.InsufficientStockException;
import com.stockflow.exception.ProductNotFoundException;
import com.stockflow.repository.MovementRepository;
import com.stockflow.repository.ProductRepository;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovementService {

    private static final Logger logger = LoggerFactory.getLogger(MovementService.class);

    private final MovementRepository movementRepository;
    private final ProductRepository productRepository;

    public MovementService(MovementRepository movementRepository, ProductRepository productRepository) {
        this.movementRepository = movementRepository;
        this.productRepository = productRepository;
    }

    @Retry(name = "movementService")
    @Transactional
    public MovementResponseDto registerMovement(MovementRequestDto request) {
        logger.info("Registering movement: productId={}, type={}, quantity={}",
                request.getProductId(), request.getType(), request.getQuantity());

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(request.getProductId()));

        if (request.getType() == MovementType.OUT) {
            validateStock(product, request.getQuantity());
            product.setCurrentStock(product.getCurrentStock() - request.getQuantity());
        } else if (request.getType() == MovementType.IN) {
            product.setCurrentStock(product.getCurrentStock() + request.getQuantity());
        }

        productRepository.save(product);

        StockAlertResponseDto alert = checkAlert(product);

        Movement movement = new Movement(product, request.getType(), request.getQuantity(), request.getReason());
        movement = movementRepository.save(movement);

        logger.info("Movement registered successfully. New stock for product {}: {}",
                product.getId(), product.getCurrentStock());

        MovementResponseDto response = toDto(movement, product);
        response.setAlert(alert);
        return response;
    }

    @RateLimiter(name = "movementHistory")
    public PageResponseDto<MovementResponseDto> getHistory(Long productId, Pageable pageable) {
        logger.info("Fetching movement history for productId={}, page={}, size={}", productId, pageable.getPageNumber(), pageable.getPageSize());

        productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        Page<Movement> movementPage = movementRepository.findByProductIdOrderByTimestampDesc(productId, pageable);

        List<MovementResponseDto> content = movementPage.getContent().stream()
                .map(m -> toDto(m, m.getProduct()))
                .collect(Collectors.toList());

        return new PageResponseDto<>(
                content,
                movementPage.getTotalElements(),
                movementPage.getTotalPages(),
                movementPage.getNumber(),
                movementPage.getSize()
        );
    }

    public ProductStatsResponseDto getStats(Long productId) {
        logger.info("Fetching stats for productId={}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        List<Movement> allMovements = movementRepository.findByProductIdOrderByTimestampDesc(
                productId,
                PageRequest.of(0, Integer.MAX_VALUE, Sort.by(Sort.Direction.DESC, "timestamp"))
        ).getContent();

        long totalIn = allMovements.stream()
                .filter(m -> m.getType() == MovementType.IN)
                .count();
        long totalOut = allMovements.stream()
                .filter(m -> m.getType() == MovementType.OUT)
                .count();
        long totalMovements = allMovements.size();
        LocalDateTime lastMovement = allMovements.isEmpty() ? null : allMovements.get(0).getTimestamp();

        double averagePerMonth = 0.0;
        if (totalMovements > 0 && lastMovement != null) {
            long months = java.time.temporal.ChronoUnit.MONTHS.between(
                    allMovements.get(allMovements.size() - 1).getTimestamp(),
                    lastMovement
            );
            months = Math.max(months, 1);
            averagePerMonth = (double) totalMovements / months;
        }

        return new ProductStatsResponseDto(
                product.getId(),
                product.getName(),
                totalMovements,
                totalIn,
                totalOut,
                averagePerMonth,
                lastMovement
        );
    }

    private void validateStock(Product product, Integer quantity) {
        if (product.getCurrentStock() < quantity) {
            throw new InsufficientStockException(
                    "Stock insuficiente. Stock actual: " + product.getCurrentStock() + ", solicitado: " + quantity);
        }
    }

    private MovementResponseDto toDto(Movement movement, Product product) {
        return new MovementResponseDto(
                movement.getId(),
                product.getId(),
                product.getName(),
                movement.getType(),
                movement.getQuantity(),
                movement.getReason(),
                movement.getTimestamp()
        );
    }

    private StockAlertResponseDto checkAlert(Product product) {
        if (product.getCurrentStock() <= product.getMinStock()) {
            AlertSeverity severity = calculateSeverity(product.getCurrentStock(), product.getMinStock());
            logger.warn("ALERTA: Producto {} ({}) tiene stock bajo. Stock: {}/{}, Severidad: {}",
                    product.getId(),
                    product.getName(),
                    product.getCurrentStock(),
                    product.getMinStock(),
                    severity);
            return new StockAlertResponseDto(
                    product.getId(),
                    product.getName(),
                    product.getCurrentStock(),
                    product.getMinStock(),
                    severity
            );
        }
        return null;
    }

    private AlertSeverity calculateSeverity(Integer currentStock, Integer minStock) {
        if (currentStock >= (minStock * 0.5)) {
            return AlertSeverity.LOW;
        }
        return AlertSeverity.CRITICAL;
    }
}