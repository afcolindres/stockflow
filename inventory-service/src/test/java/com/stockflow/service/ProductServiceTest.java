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
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.Collections;
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
    void findAll_ReturnsPageWithProducts() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("id").descending());
        Page<Product> productPage = new PageImpl<>(List.of(product), pageable, 1);
        when(productRepository.findAll(any(Pageable.class))).thenReturn(productPage);

        PageResponseDto<ProductResponseDto> result = productService.findAll(0, 10, null);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("ELEC-001", result.getContent().get(0).getSku());
    }

    @Test
    void findAll_WithCategory_ReturnsFilteredProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> productPage = new PageImpl<>(List.of(product), pageable, 1);
        when(productRepository.findByCategory(eq("Electrónica"), any(Pageable.class))).thenReturn(productPage);

        PageResponseDto<ProductResponseDto> result = productService.findAll(0, 10, "Electrónica");

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Electrónica", result.getContent().get(0).getCategory());
    }

    @Test
    void findAll_WithCategoryNoResults_ReturnsEmptyPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);
        when(productRepository.findByCategory(eq("CategoríaInvalida"), any(Pageable.class))).thenReturn(emptyPage);

        PageResponseDto<ProductResponseDto> result = productService.findAll(0, 10, "CategoríaInvalida");

        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());
    }

    @Test
    void findById_WithExistingId_ReturnsProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductResponseDto result = productService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("ELEC-001", result.getSku());
        assertEquals("Laptop Dell XPS 15", result.getName());
    }

    @Test
    void findById_WithNonExistingId_ThrowsProductNotFoundException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> productService.findById(999L));
    }
}