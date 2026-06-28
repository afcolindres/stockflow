package com.stockflow.controller;

import com.stockflow.dto.ApiResponseWrapper;
import com.stockflow.dto.StockAlertResponseDto;
import com.stockflow.entity.AlertSeverity;
import com.stockflow.exception.GlobalExceptionHandler;
import com.stockflow.service.AlertService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AlertControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AlertService alertService;

    @InjectMocks
    private AlertController alertController;

    private StockAlertResponseDto alertDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(alertController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        alertDto = new StockAlertResponseDto(
                1L,
                "Laptop Dell XPS 15",
                3,
                5,
                AlertSeverity.LOW
        );
    }

    @Test
    void getAlerts_WithAlerts_ReturnsAlertList() throws Exception {
        when(alertService.getAlerts()).thenReturn(List.of(alertDto));

        mockMvc.perform(get("/api/v1/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].productId").value(1));
    }

    @Test
    void getAlerts_WithNoAlerts_ReturnsEmptyList() throws Exception {
        when(alertService.getAlerts()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    void getAlerts_WithMultipleAlerts_ReturnsAllAlerts() throws Exception {
        StockAlertResponseDto alert2 = new StockAlertResponseDto(
                2L,
                "Mouse",
                1,
                5,
                AlertSeverity.CRITICAL
        );
        when(alertService.getAlerts()).thenReturn(List.of(alertDto, alert2));

        mockMvc.perform(get("/api/v1/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCode").value(200))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2));
    }
}