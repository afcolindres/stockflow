package com.stockflow.controller;

import com.stockflow.dto.ApiResponseWrapper;
import com.stockflow.dto.PageResponseDto;
import com.stockflow.dto.ProductResponseDto;
import com.stockflow.exception.GlobalExceptionHandler;
import com.stockflow.exception.ProductNotFoundException;
import com.stockflow.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    private ProductResponseDto productDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        productDto = new ProductResponseDto(
                1L,
                "ELEC-001",
                "Laptop Dell XPS 15",
                "Electrónica",
                10,
                5,
                new BigDecimal("1299.99")
        );
    }

    @Test
    void getProducts_ReturnsPagedProducts() throws Exception {
        PageResponseDto<ProductResponseDto> pageResponse = new PageResponseDto<>(
                List.of(productDto),
                1L,
                1,
                0,
                10
        );
        when(productService.findAll(0, 10, null)).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content[0].sku").value("ELEC-001"));
    }

    @Test
    void getProducts_WithCategoryFilter_ReturnsFilteredProducts() throws Exception {
        PageResponseDto<ProductResponseDto> pageResponse = new PageResponseDto<>(
                List.of(productDto),
                1L,
                1,
                0,
                10
        );
        when(productService.findAll(0, 10, "Electrónica")).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/products")
                        .param("category", "Electrónica"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.data.content[0].category").value("Electrónica"));
    }

    @Test
    void getProducts_WithNoResults_ReturnsEmptyPage() throws Exception {
        PageResponseDto<ProductResponseDto> emptyPage = new PageResponseDto<>(
                Collections.emptyList(),
                0L,
                0,
                0,
                10
        );
        when(productService.findAll(0, 10, "CategoríaInvalida")).thenReturn(emptyPage);

        mockMvc.perform(get("/api/v1/products")
                        .param("category", "CategoríaInvalida"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.data.content").isEmpty());
    }

    @Test
    void getProductById_WithExistingId_ReturnsProduct() throws Exception {
        when(productService.findById(1L)).thenReturn(productDto);

        mockMvc.perform(get("/api/v1/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.sku").value("ELEC-001"))
                .andExpect(jsonPath("$.data.name").value("Laptop Dell XPS 15"));
    }

    @Test
    void getProductById_WithNonExistingId_Returns404() throws Exception {
        when(productService.findById(999L)).thenThrow(new ProductNotFoundException(999L));

        mockMvc.perform(get("/api/v1/products/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }
}