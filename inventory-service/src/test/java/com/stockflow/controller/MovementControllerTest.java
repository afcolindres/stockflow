package com.stockflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stockflow.dto.MovementRequestDto;
import com.stockflow.dto.MovementResponseDto;
import com.stockflow.dto.PageResponseDto;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1));
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
        when(movementService.registerMovement(any(MovementRequestDto.class)))
                .thenThrow(new ProductNotFoundException(999L));

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void createMovement_InsufficientStock_Returns422() throws Exception {
        MovementRequestDto request = new MovementRequestDto(1L, MovementType.OUT, 100, "Venta");
        when(movementService.registerMovement(any(MovementRequestDto.class)))
                .thenThrow(new InsufficientStockException("Stock insuficiente"));

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void getHistory_ExistingProduct_ReturnsHistory() throws Exception {
        PageResponseDto<MovementResponseDto> pageResponse = new PageResponseDto<>(
                List.of(movementResponseDto),
                1,
                0,
                0,
                10
        );
        when(movementService.getHistory(eq(1L), any(Pageable.class))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/movements/1/history")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    void getHistory_NonExistingProduct_Returns404() throws Exception {
        when(movementService.getHistory(eq(999L), any(Pageable.class)))
                .thenThrow(new ProductNotFoundException(999L));

        mockMvc.perform(get("/api/v1/movements/999/history")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getHistory_WithPagination_ReturnsPagedHistory() throws Exception {
        PageResponseDto<MovementResponseDto> pageResponse = new PageResponseDto<>(
                List.of(movementResponseDto),
                1,
                1,
                0,
                10
        );
        when(movementService.getHistory(eq(1L), any(Pageable.class))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/movements/1/history")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalPages").value(1));
    }
}