package com.stockflow.repository;

import com.stockflow.entity.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ProductRepositoryTest {

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
    }

    @Test
    void findBySku_ExistingSku_ReturnsProduct() {
        productRepository.save(product);

        Optional<Product> result = productRepository.findBySku(product.getSku());

        assertTrue(result.isPresent());
        assertEquals("Test Product", result.get().getName());
    }

    @Test
    void findBySku_NonExistingSku_ReturnsEmpty() {
        Optional<Product> result = productRepository.findBySku("NONEXISTENT");

        assertTrue(result.isEmpty());
    }

    @Test
    void existsBySku_ExistingSku_ReturnsTrue() {
        productRepository.save(product);

        boolean result = productRepository.existsBySku(product.getSku());

        assertTrue(result);
    }

    @Test
    void existsBySku_NonExistingSku_ReturnsFalse() {
        boolean result = productRepository.existsBySku("NONEXISTENT");

        assertFalse(result);
    }

    @Test
    void findByCategory_WithCategory_ReturnsProducts() {
        productRepository.save(product);
        Pageable pageable = PageRequest.of(0, 10);

        Page<Product> result = productRepository.findByCategory("TestCategory", pageable);

        assertEquals(1, result.getTotalElements());
    }

    @Test
    void findAllCategories_ReturnsDistinctCategories() {
        Product product2 = new Product();
        product2.setSku("TEST2-" + UUID.randomUUID().toString().substring(0, 8));
        product2.setName("Product 2");
        product2.setCategory("UniqueCategory");
        product2.setCurrentStock(5);
        product2.setMinStock(2);
        product2.setUnitPrice(new BigDecimal("50.00"));

        productRepository.save(product);
        productRepository.save(product2);

        List<String> result = productRepository.findAllCategories();

        assertTrue(result.size() >= 1);
    }

    @Test
    void searchByQuery_WithNameMatch_ReturnsProducts() {
        productRepository.save(product);
        Pageable pageable = PageRequest.of(0, 10);

        List<Product> result = productRepository.searchByQuery("Test", pageable);

        assertEquals(1, result.size());
    }

    @Test
    void searchByQuery_WithSkuMatch_ReturnsProducts() {
        productRepository.save(product);
        Pageable pageable = PageRequest.of(0, 10);

        List<Product> result = productRepository.searchByQuery("TEST", pageable);

        assertEquals(1, result.size());
    }

    @Test
    void searchByQuery_NoMatch_ReturnsEmpty() {
        productRepository.save(product);
        Pageable pageable = PageRequest.of(0, 10);

        List<Product> result = productRepository.searchByQuery("NonExistent", pageable);

        assertTrue(result.isEmpty());
    }

    @Test
    void findById_WithExistingId_ReturnsProduct() {
        Product saved = productRepository.save(product);

        Optional<Product> result = productRepository.findById(saved.getId());

        assertTrue(result.isPresent());
        assertEquals(saved.getId(), result.get().getId());
    }

    @Test
    void findById_WithNonExistingId_ReturnsEmpty() {
        Optional<Product> result = productRepository.findById(99999L);

        assertTrue(result.isEmpty());
    }

    @Test
    void save_ProductWithAllFields_PersistsCorrectly() {
        Product newProduct = new Product();
        newProduct.setSku("FULL-" + UUID.randomUUID().toString().substring(0, 8));
        newProduct.setName("Full Test Product");
        newProduct.setCategory("FullCategory");
        newProduct.setCurrentStock(15);
        newProduct.setMinStock(10);
        newProduct.setUnitPrice(new BigDecimal("250.50"));

        Product saved = productRepository.save(newProduct);

        assertNotNull(saved.getId());
        assertEquals("Full Test Product", saved.getName());
        assertEquals("FullCategory", saved.getCategory());
        assertEquals(15, saved.getCurrentStock());
        assertEquals(10, saved.getMinStock());
        assertEquals(new BigDecimal("250.50"), saved.getUnitPrice());
    }
}