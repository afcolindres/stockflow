package com.stockflow.repository;

import com.stockflow.entity.Movement;
import com.stockflow.entity.MovementType;
import com.stockflow.entity.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class MovementRepositoryTest {

    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private ProductRepository productRepository;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setSku("TEST-" + UUID.randomUUID().toString().substring(0, 8));
        product.setName("Test Product");
        product.setCategory("TestCategory");
        product.setCurrentStock(10);
        product.setMinStock(5);
        product.setUnitPrice(new BigDecimal("100.00"));
        productRepository.save(product);
    }

    @Test
    void save_SavesMovement() {
        Movement movement = new Movement(product, MovementType.IN, 10, "Test");
        movement.setTimestamp(LocalDateTime.now());

        Movement saved = movementRepository.save(movement);

        assertNotNull(saved.getId());
    }

    @Test
    void findById_ExistingMovement_ReturnsMovement() {
        Movement movement = new Movement(product, MovementType.IN, 10, "Test");
        movement.setTimestamp(LocalDateTime.now());
        Movement saved = movementRepository.save(movement);

        Optional<Movement> result = movementRepository.findById(saved.getId());

        assertTrue(result.isPresent());
    }

    @Test
    void findByProductIdOrderByTimestampDesc_WithMovements_ReturnsList() {
        Movement movement1 = new Movement(product, MovementType.IN, 5, "Test 1");
        movement1.setTimestamp(LocalDateTime.now().minusDays(1));
        movementRepository.save(movement1);

        Movement movement2 = new Movement(product, MovementType.OUT, 3, "Test 2");
        movement2.setTimestamp(LocalDateTime.now());
        movementRepository.save(movement2);

        List<Movement> result = movementRepository.findByProductIdOrderByTimestampDesc(product.getId());

        assertEquals(2, result.size());
    }

    @Test
    void findByProductIdOrderByTimestampDesc_NoMovements_ReturnsEmpty() {
        List<Movement> result = movementRepository.findByProductIdOrderByTimestampDesc(999L);

        assertTrue(result.isEmpty());
    }

    @Test
    void findByProductIdOrderByTimestampDesc_WithPageable_ReturnsPage() {
        Movement movement1 = new Movement(product, MovementType.IN, 5, "Test 1");
        movement1.setTimestamp(LocalDateTime.now().minusDays(1));
        movementRepository.save(movement1);

        Movement movement2 = new Movement(product, MovementType.OUT, 3, "Test 2");
        movement2.setTimestamp(LocalDateTime.now());
        movementRepository.save(movement2);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Movement> result = movementRepository.findByProductIdOrderByTimestampDesc(product.getId(), pageable);

        assertEquals(2, result.getTotalElements());
    }

    @Test
    void findByProductIdOrderByTimestampDesc_OrdersByTimestampDesc() {
        Movement movement1 = new Movement(product, MovementType.IN, 5, "Test 1");
        movement1.setTimestamp(LocalDateTime.now().minusDays(1));
        movementRepository.save(movement1);

        Movement movement2 = new Movement(product, MovementType.OUT, 3, "Test 2");
        movement2.setTimestamp(LocalDateTime.now());
        movementRepository.save(movement2);

        List<Movement> result = movementRepository.findByProductIdOrderByTimestampDesc(product.getId());

        assertTrue(result.get(0).getTimestamp().isAfter(result.get(1).getTimestamp()));
    }
}