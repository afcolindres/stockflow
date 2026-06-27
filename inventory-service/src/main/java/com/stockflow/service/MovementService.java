package com.stockflow.service;

import com.stockflow.dto.MovementRequestDto;
import com.stockflow.dto.MovementResponseDto;
import com.stockflow.entity.Movement;
import com.stockflow.entity.MovementType;
import com.stockflow.entity.Product;
import com.stockflow.exception.InsufficientStockException;
import com.stockflow.exception.ProductNotFoundException;
import com.stockflow.repository.MovementRepository;
import com.stockflow.repository.ProductRepository;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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

        Movement movement = new Movement(product, request.getType(), request.getQuantity(), request.getReason());
        movement = movementRepository.save(movement);

        logger.info("Movement registered successfully. New stock for product {}: {}",
                product.getId(), product.getCurrentStock());

        return toDto(movement, product);
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
}