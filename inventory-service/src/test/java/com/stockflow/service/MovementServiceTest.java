package com.stockflow.service;

import com.stockflow.dto.MovementRequestDto;
import com.stockflow.dto.MovementResponseDto;
import com.stockflow.entity.AlertSeverity;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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

    @Test
    void getHistory_WithMovements_ReturnsHistory() {
        Movement movement = new Movement(product, MovementType.OUT, 5, "Venta");
        movement.setId(1L);
        movement.setTimestamp(LocalDateTime.now());

        Page<Movement> page = new PageImpl<>(List.of(movement));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.findByProductIdOrderByTimestampDesc(eq(1L), any(Pageable.class))).thenReturn(page);

        List<MovementResponseDto> history = movementService.getHistory(1L, 0, 10);

        assertNotNull(history);
        assertEquals(1, history.size());
        assertEquals(1L, history.get(0).getId());
    }

    @Test
    void getHistory_ProductNotFoundThrowsException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> movementService.getHistory(999L, 0, 10));
    }

    @Test
    void getHistory_WithNoMovements_ReturnsEmptyList() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.findByProductIdOrderByTimestampDesc(eq(1L), any(Pageable.class)))
                .thenReturn(Page.empty());

        List<MovementResponseDto> history = movementService.getHistory(1L, 0, 10);

        assertNotNull(history);
        assertTrue(history.isEmpty());
    }

    @Test
    void registerMovement_OutputBelowMinStock_ReturnsAlert() {
        product.setCurrentStock(10);
        product.setMinStock(10);
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.OUT, 6, "Venta");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> {
            Movement m = invocation.getArgument(0);
            m.setId(1L);
            return m;
        });

        MovementResponseDto result = movementService.registerMovement(request);

        assertNotNull(result.getAlert());
        assertEquals(AlertSeverity.CRITICAL, result.getAlert().getSeverity());
        assertEquals(4, result.getAlert().getCurrentStock());
    }

    @Test
    void registerMovement_InAboveMinStock_NoAlert() {
        product.setCurrentStock(5);
        product.setMinStock(10);
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.IN, 10, "Reposición");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> {
            Movement m = invocation.getArgument(0);
            m.setId(1L);
            return m;
        });

        MovementResponseDto result = movementService.registerMovement(request);

        assertNull(result.getAlert());
    }

    @Test
    void registerMovement_InBelowMinStock_ReturnsAlert() {
        product.setCurrentStock(2);
        product.setMinStock(10);
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.IN, 5, "Reposición parcial");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> {
            Movement m = invocation.getArgument(0);
            m.setId(1L);
            return m;
        });

        MovementResponseDto result = movementService.registerMovement(request);

        assertNotNull(result.getAlert());
        assertEquals(AlertSeverity.LOW, result.getAlert().getSeverity());
    }
}