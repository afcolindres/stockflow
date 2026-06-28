package com.stockflow.controller;

import com.stockflow.dto.PageResponseDto;
import com.stockflow.dto.ProductResponseDto;
import com.stockflow.dto.ProductStatsResponseDto;
import com.stockflow.entity.Product;
import com.stockflow.exception.GlobalExceptionHandler;
import com.stockflow.exception.ProductNotFoundException;
import com.stockflow.service.MovementService;
import com.stockflow.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @Mock
    private MovementService movementService;

    @InjectMocks
    private ProductController productController;

    private ProductResponseDto productResponseDto;
    private ProductStatsResponseDto statsResponseDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        productResponseDto = new ProductResponseDto(
                1L,
                "ELEC-001",
                "Laptop Dell XPS 15",
                "Electrónica",
                10,
                5,
                new BigDecimal("1299.99")
        );

        statsResponseDto = new ProductStatsResponseDto(
                1L,
                "Laptop Dell XPS 15",
                5L,
                3L,
                2L,
                1.5,
                LocalDateTime.now()
        );
    }

    @Test
    void getProducts_ReturnsProductList() throws Exception {
        PageResponseDto<ProductResponseDto> pageResponse = new PageResponseDto<>(
                List.of(productResponseDto),
                1,
                0,
                0,
                10
        );
        when(productService.findAll(anyInt(), anyInt(), any())).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk());
    }

    @Test
    void getProducts_WithCategory_ReturnsFilteredList() throws Exception {
        PageResponseDto<ProductResponseDto> pageResponse = new PageResponseDto<>(
                List.of(productResponseDto),
                1,
                0,
                0,
                10
        );
        when(productService.findAll(eq(0), eq(10), eq("Electrónica"))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/products")
                        .param("page", "0")
                        .param("size", "10")
                        .param("category", "Electrónica"))
                .andExpect(status().isOk());
    }

    @Test
    void getProductById_ExistingProduct_ReturnsProduct() throws Exception {
        when(productService.findById(1L)).thenReturn(productResponseDto);

        mockMvc.perform(get("/api/v1/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.sku").value("ELEC-001"));
    }

    @Test
    void getProductById_NonExistingProduct_Returns404() throws Exception {
        when(productService.findById(999L)).thenThrow(new ProductNotFoundException(999L));

        mockMvc.perform(get("/api/v1/products/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getCategories_ReturnsCategoryList() throws Exception {
        when(productService.findAllCategories()).thenReturn(List.of("Electrónica", "Hogar"));

        mockMvc.perform(get("/api/v1/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void searchProducts_ReturnsMatchingProducts() throws Exception {
        when(productService.search(anyString(), anyInt())).thenReturn(List.of(productResponseDto));

        mockMvc.perform(get("/api/v1/products/search")
                        .param("q", "Dell")
                        .param("limit", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void getProductStats_ExistingProduct_ReturnsStats() throws Exception {
        when(movementService.getStats(1L)).thenReturn(statsResponseDto);

        mockMvc.perform(get("/api/v1/products/1/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalMovements").value(5));
    }

    @Test
    void getProductStats_NonExistingProduct_Returns404() throws Exception {
        when(movementService.getStats(999L)).thenThrow(new ProductNotFoundException(999L));

        mockMvc.perform(get("/api/v1/products/999/stats"))
                .andExpect(status().isNotFound());
    }
}