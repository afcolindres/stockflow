package com.stockflow.service;

import com.stockflow.dto.StockAlertResponseDto;
import com.stockflow.entity.AlertSeverity;
import com.stockflow.entity.Product;
import com.stockflow.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private AlertService alertService;

    private Product productOk;
    private Product productLow;
    private Product productCritical;

    @BeforeEach
    void setUp() {
        productOk = new Product();
        productOk.setId(1L);
        productOk.setSku("ELEC-001");
        productOk.setName("Laptop Dell XPS 15");
        productOk.setCategory("Electrónica");
        productOk.setCurrentStock(10);
        productOk.setMinStock(5);
        productOk.setUnitPrice(new BigDecimal("1299.99"));

        productLow = new Product();
        productLow.setId(2L);
        productLow.setSku("ELEC-002");
        productLow.setName("Mouse Inalámbrico");
        productLow.setCategory("Electrónica");
        productLow.setCurrentStock(3);
        productLow.setMinStock(5);
        productLow.setUnitPrice(new BigDecimal("29.99"));

        productCritical = new Product();
        productCritical.setId(3L);
        productCritical.setSku("ELEC-003");
        productCritical.setName("Teclado Mecánico");
        productCritical.setCategory("Electrónica");
        productCritical.setCurrentStock(1);
        productCritical.setMinStock(5);
        productCritical.setUnitPrice(new BigDecimal("89.99"));
    }

    @Test
    void getAlerts_WithAlerts_ReturnsAlertList() {
        when(productRepository.findAll()).thenReturn(List.of(productOk, productLow, productCritical));

        List<StockAlertResponseDto> result = alertService.getAlerts();

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void getAlerts_WithNoAlerts_ReturnsEmptyList() {
        when(productRepository.findAll()).thenReturn(List.of(productOk));

        List<StockAlertResponseDto> result = alertService.getAlerts();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getAlerts_WithLowStock_ReturnsLowSeverity() {
        when(productRepository.findAll()).thenReturn(List.of(productLow));

        List<StockAlertResponseDto> result = alertService.getAlerts();

        assertNotNull(result);
        assertEquals(AlertSeverity.LOW, result.get(0).getSeverity());
    }

    @Test
    void getAlerts_WithCriticalStock_ReturnsCriticalSeverity() {
        when(productRepository.findAll()).thenReturn(List.of(productCritical));

        List<StockAlertResponseDto> result = alertService.getAlerts();

        assertNotNull(result);
        assertEquals(AlertSeverity.CRITICAL, result.get(0).getSeverity());
    }

    @Test
    void countCriticalAlerts_WithCriticalAlerts_ReturnsCount() {
        when(productRepository.findAll()).thenReturn(List.of(productOk, productLow, productCritical));

        long count = alertService.countCriticalAlerts();

        assertEquals(1, count);
    }

    @Test
    void countCriticalAlerts_WithNoCriticalAlerts_ReturnsZero() {
        when(productRepository.findAll()).thenReturn(List.of(productOk));

        long count = alertService.countCriticalAlerts();

        assertEquals(0, count);
    }

    @Test
    void countTotalAlerts_WithAlerts_ReturnsCount() {
        when(productRepository.findAll()).thenReturn(List.of(productOk, productLow, productCritical));

        long count = alertService.countTotalAlerts();

        assertEquals(2, count);
    }

    @Test
    void countTotalAlerts_WithNoAlerts_ReturnsZero() {
        when(productRepository.findAll()).thenReturn(List.of(productOk));

        long count = alertService.countTotalAlerts();

        assertEquals(0, count);
    }
}