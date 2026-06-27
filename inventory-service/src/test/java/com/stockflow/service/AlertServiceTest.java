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
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private AlertService alertService;

    private Product productLowStock;
    private Product productCriticalStock;
    private Product productNormalStock;

    @BeforeEach
    void setUp() {
        productLowStock = new Product();
        productLowStock.setId(1L);
        productLowStock.setSku("ELEC-001");
        productLowStock.setName("Laptop Dell XPS 15");
        productLowStock.setCategory("Electrónica");
        productLowStock.setCurrentStock(5);
        productLowStock.setMinStock(10);
        productLowStock.setUnitPrice(new BigDecimal("1299.99"));

        productCriticalStock = new Product();
        productCriticalStock.setId(2L);
        productCriticalStock.setSku("ELEC-002");
        productCriticalStock.setName("Mouse Logitech");
        productCriticalStock.setCategory("Accesorios");
        productCriticalStock.setCurrentStock(3);
        productCriticalStock.setMinStock(10);
        productCriticalStock.setUnitPrice(new BigDecimal("29.99"));

        productNormalStock = new Product();
        productNormalStock.setId(3L);
        productNormalStock.setSku("ELEC-003");
        productNormalStock.setName("Teclado Mecánico");
        productNormalStock.setCategory("Electrónica");
        productNormalStock.setCurrentStock(20);
        productNormalStock.setMinStock(5);
        productNormalStock.setUnitPrice(new BigDecimal("89.99"));
    }

    @Test
    void getAlerts_WithLowStock_ReturnsLowSeverity() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(productLowStock));

        List<StockAlertResponseDto> alerts = alertService.getAlerts();

        assertEquals(1, alerts.size());
        assertEquals(AlertSeverity.LOW, alerts.get(0).getSeverity());
    }

    @Test
    void getAlerts_WithCriticalStock_ReturnsCriticalSeverity() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(productCriticalStock));

        List<StockAlertResponseDto> alerts = alertService.getAlerts();

        assertEquals(1, alerts.size());
        assertEquals(AlertSeverity.CRITICAL, alerts.get(0).getSeverity());
    }

    @Test
    void getAlerts_WithNoAlerts_ReturnsEmptyList() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(productNormalStock));

        List<StockAlertResponseDto> alerts = alertService.getAlerts();

        assertTrue(alerts.isEmpty());
    }

    @Test
    void getAlerts_WithMultipleAlerts_ReturnsAllAlerts() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(productLowStock, productCriticalStock));

        List<StockAlertResponseDto> alerts = alertService.getAlerts();

        assertEquals(2, alerts.size());
    }

    @Test
    void countCriticalAlerts_CorrectCount() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(productLowStock, productCriticalStock));

        long count = alertService.countCriticalAlerts();

        assertEquals(1, count);
    }

    @Test
    void countTotalAlerts_CorrectCount() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(productLowStock, productCriticalStock));

        long count = alertService.countTotalAlerts();

        assertEquals(2, count);
    }
}