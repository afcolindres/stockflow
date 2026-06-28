package com.stockflow.service;

import com.stockflow.dto.MovementRequestDto;
import com.stockflow.dto.MovementResponseDto;
import com.stockflow.dto.PageResponseDto;
import com.stockflow.dto.ProductStatsResponseDto;
import com.stockflow.dto.StockAlertResponseDto;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
    private Movement movement;

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

        movement = new Movement(product, MovementType.IN, 10, "Reposición");
        movement.setId(1L);
        movement.setTimestamp(LocalDateTime.now());
    }

    @Test
    void registerMovement_WithInput_IncreasesStock() {
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.IN, 10, "Reposición");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(movementRepository.save(any(Movement.class))).thenReturn(movement);

        MovementResponseDto result = movementService.registerMovement(request);

        assertNotNull(result);
        assertEquals(1L, result.getProductId());
        assertEquals(MovementType.IN, result.getType());
        assertEquals(10, result.getQuantity());
        verify(productRepository).save(product);
    }

    @Test
    void registerMovement_WithOutput_DecreasesStock() {
        product.setCurrentStock(10);
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.OUT, 5, "Venta");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setCurrentStock(p.getCurrentStock() - 5);
            return p;
        });
        when(movementRepository.save(any(Movement.class))).thenAnswer(invocation -> {
            Movement m = invocation.getArgument(0);
            m.setId(1L);
            m.setTimestamp(LocalDateTime.now());
            return m;
        });

        MovementResponseDto result = movementService.registerMovement(request);

        assertNotNull(result);
        assertEquals(MovementType.OUT, result.getType());
        assertEquals(5, result.getQuantity());
    }

    @Test
    void registerMovement_WithInsufficientStock_ThrowsException() {
        product.setCurrentStock(5);
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.OUT, 10, "Venta");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class, () -> movementService.registerMovement(request));
        verify(productRepository, never()).save(any());
    }

    @Test
    void registerMovement_WithNonExistingProduct_ThrowsException() {
        MovementRequestDto request = new MovementRequestDto(999L, MovementType.IN, 10, "Reposición");
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> movementService.registerMovement(request));
    }

    @Test
    void registerMovement_WithStockBelowMin_CreatesAlert() {
        product.setCurrentStock(3);
        product.setMinStock(5);
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.OUT, 2, "Venta");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(movementRepository.save(any(Movement.class))).thenReturn(movement);

        MovementResponseDto result = movementService.registerMovement(request);

        assertNotNull(result.getAlert());
        assertEquals(1L, result.getAlert().getProductId());
    }

    @Test
    void getHistory_WithMovements_ReturnsPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Movement> movementPage = new PageImpl<>(List.of(movement), pageable, 1);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.findByProductIdOrderByTimestampDesc(eq(1L), any(Pageable.class))).thenReturn(movementPage);

        PageResponseDto<MovementResponseDto> result = movementService.getHistory(1L, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
    }

    @Test
    void getHistory_WithNonExistingProduct_ThrowsException() {
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> movementService.getHistory(999L, pageable));
    }

    @Test
    void getHistory_WithNoMovements_ReturnsEmptyPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Movement> emptyPage = new PageImpl<>(List.of(), pageable, 0);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.findByProductIdOrderByTimestampDesc(eq(1L), any(Pageable.class))).thenReturn(emptyPage);

        PageResponseDto<MovementResponseDto> result = movementService.getHistory(1L, pageable);

        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());
        assertEquals(0, result.getTotalElements());
    }

    @Test
    void getStats_WithMovements_ReturnsStats() {
        List<Movement> movements = List.of(
                createMovement(MovementType.IN, 5),
                createMovement(MovementType.IN, 3),
                createMovement(MovementType.OUT, 2)
        );
        Page<Movement> movementPage = new PageImpl<>(movements, PageRequest.of(0, 10), movements.size());
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.findByProductIdOrderByTimestampDesc(eq(1L), any(Pageable.class))).thenReturn(movementPage);

        ProductStatsResponseDto result = movementService.getStats(1L);

        assertNotNull(result);
        assertEquals(1L, result.getProductId());
        assertEquals(3, result.getTotalMovements());
        assertEquals(2, result.getTotalIn());
        assertEquals(1, result.getTotalOut());
    }

    @Test
    void getStats_WithNoMovements_ReturnsZeros() {
        Page<Movement> emptyPage = new PageImpl<>(List.of(), PageRequest.of(0, 10), 0);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.findByProductIdOrderByTimestampDesc(eq(1L), any(Pageable.class))).thenReturn(emptyPage);

        ProductStatsResponseDto result = movementService.getStats(1L);

        assertNotNull(result);
        assertEquals(0, result.getTotalMovements());
        assertEquals(0, result.getTotalIn());
        assertEquals(0, result.getTotalOut());
    }

    @Test
    void getStats_WithNonExistingProduct_ThrowsException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> movementService.getStats(999L));
    }

    private Movement createMovement(MovementType type, int quantity) {
        Movement m = new Movement(product, type, quantity, "Test");
        m.setId(1L);
        m.setTimestamp(LocalDateTime.now());
        return m;
    }
}