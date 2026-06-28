package com.stockflow.service;

import com.stockflow.dto.PageResponseDto;
import com.stockflow.dto.ProductResponseDto;
import com.stockflow.entity.Product;
import com.stockflow.exception.ProductNotFoundException;
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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

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
    void findAll_WithCategory_ReturnsProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> productPage = new PageImpl<>(List.of(product), pageable, 1);
        when(productRepository.findByCategory(eq("Electrónica"), any(Pageable.class))).thenReturn(productPage);

        PageResponseDto<ProductResponseDto> result = productService.findAll(0, 10, "Electrónica");

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("ELEC-001", result.getContent().get(0).getSku());
    }

    @Test
    void findAll_WithoutCategory_ReturnsAllProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> productPage = new PageImpl<>(List.of(product), pageable, 1);
        when(productRepository.findAll(any(Pageable.class))).thenReturn(productPage);

        PageResponseDto<ProductResponseDto> result = productService.findAll(0, 10, null);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
    }

    @Test
    void findById_ExistingProduct_ReturnsProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductResponseDto result = productService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("ELEC-001", result.getSku());
    }

    @Test
    void findById_NonExistingProduct_ThrowsException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> productService.findById(999L));
    }

    @Test
    void findAllCategories_ReturnsCategoryList() {
        when(productRepository.findAllCategories()).thenReturn(List.of("Electrónica", "Hogar", "Oficina"));

        List<String> result = productService.findAllCategories();

        assertNotNull(result);
        assertEquals(3, result.size());
        assertTrue(result.contains("Electrónica"));
    }

    @Test
    void search_WithQuery_ReturnsMatchingProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.searchByQuery(eq("Dell"), any(Pageable.class))).thenReturn(List.of(product));

        List<ProductResponseDto> result = productService.search("Dell", 10);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Laptop Dell XPS 15", result.get(0).getName());
    }

    @Test
    void search_NoMatchingQuery_ReturnsEmptyList() {
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.searchByQuery(eq("NonExistent"), any(Pageable.class))).thenReturn(List.of());

        List<ProductResponseDto> result = productService.search("NonExistent", 10);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}