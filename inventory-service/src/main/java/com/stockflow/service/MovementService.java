package com.stockflow.service;

import com.stockflow.dto.MovementRequestDto;
import com.stockflow.dto.MovementResponseDto;
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
    public List<MovementResponseDto> getHistory(Long productId, int page, int size) {
        logger.info("Fetching movement history for productId={}, page={}, size={}", productId, page, size);

        productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<Movement> movementPage = movementRepository.findByProductIdOrderByTimestampDesc(productId, pageable);

        return movementPage.getContent().stream()
                .map(m -> toDto(m, m.getProduct()))
                .collect(Collectors.toList());
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