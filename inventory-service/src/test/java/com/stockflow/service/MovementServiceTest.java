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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovementServiceTest {

    @Mock
    private MovementRepository movementRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private MovementService movementService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setSku("ELEC-001");
        product.setName("Laptop Dell XPS 15");
        product.setCategory("Electrónica");
        product.setCurrentStock(10);
        product.setMinStock(5);
        product.setUnitPrice(new BigDecimal("1299.99"));
    }

    @Test
    void registerMovement_InputIncreasesStock() {
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.IN, 10, "Reposición");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> {
            Movement m = invocation.getArgument(0);
            m.setId(1L);
            return m;
        });

        MovementResponseDto result = movementService.registerMovement(request);

        assertNotNull(result);
        assertEquals(1L, result.getProductId());
        assertEquals(MovementType.IN, result.getType());
        assertEquals(10, result.getQuantity());
        assertEquals(20, product.getCurrentStock());
        verify(productRepository).save(product);
    }

    @Test
    void registerMovement_OutputDecreasesStock() {
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.OUT, 5, "Venta");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> {
            Movement m = invocation.getArgument(0);
            m.setId(1L);
            return m;
        });

        MovementResponseDto result = movementService.registerMovement(request);

        assertNotNull(result);
        assertEquals(1L, result.getProductId());
        assertEquals(MovementType.OUT, result.getType());
        assertEquals(5, result.getQuantity());
        assertEquals(5, product.getCurrentStock());
        verify(productRepository).save(product);
    }

    @Test
    void registerMovement_InsufficientStockThrowsException() {
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.OUT, 15, "Venta");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class, () -> movementService.registerMovement(request));
        verify(productRepository, never()).save(any());
    }

    @Test
    void registerMovement_ProductNotFoundThrowsException() {
        MovementRequestDto request = new MovementRequestDto(999L, MovementType.IN, 10, "Reposición");
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> movementService.registerMovement(request));
    }

    @Test
    void registerMovement_OutputToMinimumStockSucceeds() {
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.OUT, 10, "Venta total");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> {
            Movement m = invocation.getArgument(0);
            m.setId(1L);
            return m;
        });

        MovementResponseDto result = movementService.registerMovement(request);

        assertNotNull(result);
        assertEquals(0, product.getCurrentStock());
    }
}