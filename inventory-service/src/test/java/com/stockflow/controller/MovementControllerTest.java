package com.stockflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stockflow.dto.ApiResponseWrapper;
import com.stockflow.dto.MovementRequestDto;
import com.stockflow.dto.MovementResponseDto;
import com.stockflow.entity.MovementType;
import com.stockflow.exception.GlobalExceptionHandler;
import com.stockflow.exception.InsufficientStockException;
import com.stockflow.exception.ProductNotFoundException;
import com.stockflow.service.MovementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class MovementControllerTest {

    private MockMvc mockMvc;

    @Mock
    private MovementService movementService;

    @InjectMocks
    private MovementController movementController;

    private ObjectMapper objectMapper;
    private MovementResponseDto movementResponseDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(movementController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        objectMapper = new ObjectMapper();

        movementResponseDto = new MovementResponseDto(
                1L,
                1L,
                "Laptop Dell XPS 15",
                MovementType.IN,
                10,
                "Reposición",
                LocalDateTime.now()
        );
    }

    @Test
    void createMovement_ValidInput_ReturnsSuccess() throws Exception {
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.IN, 10, "Reposición");
        when(movementService.registerMovement(any(MovementRequestDto.class))).thenReturn(movementResponseDto);

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(jsonPath("$.statusCode").value(201))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.productId").value(1));
    }

    @Test
    void createMovement_InvalidInput_Returns400() throws Exception {
        MovementRequestDto request = new MovementRequestDto(null, null, null, null);

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createMovement_ProductNotFound_Returns404() throws Exception {
        MovementRequestDto request = new MovementRequestDto(999L, MovementType.IN, 10, "Reposición");
        when(movementService.registerMovement(any(MovementRequestDto.class))).thenThrow(new ProductNotFoundException(999L));

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void createMovement_InsufficientStock_Returns422() throws Exception {
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.OUT, 100, "Venta");
        when(movementService.registerMovement(any(MovementRequestDto.class)))
                .thenThrow(new InsufficientStockException("Stock insuficiente"));

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.status").value(422));
    }
}