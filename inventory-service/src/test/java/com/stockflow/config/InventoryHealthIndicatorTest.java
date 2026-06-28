package com.stockflow.config;

import com.stockflow.service.AlertService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.Status;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InventoryHealthIndicatorTest {

    @Mock
    private AlertService alertService;

    @InjectMocks
    private InventoryHealthIndicator healthIndicator;

    @BeforeEach
    void setUp() {
    }

    @Test
    void health_WithNoAlerts_ReturnsUp() {
        when(alertService.countTotalProducts()).thenReturn(0L);

        Health health = healthIndicator.health();

        assertNotNull(health);
        assertEquals(Status.UP, health.getStatus());
        assertEquals("No hay productos registrados", health.getDetails().get("message"));
    }

    @Test
    void health_WithLowCriticalPercentage_ReturnsUp() {
        when(alertService.countTotalProducts()).thenReturn(100L);
        when(alertService.countTotalAlerts()).thenReturn(10L);
        when(alertService.countCriticalAlerts()).thenReturn(1L);

        Health health = healthIndicator.health();

        assertNotNull(health);
        assertEquals(Status.UP, health.getStatus());
    }

    @Test
    void health_WithHighCriticalPercentage_ReturnsDown() {
        when(alertService.countTotalProducts()).thenReturn(10L);
        when(alertService.countTotalAlerts()).thenReturn(10L);
        when(alertService.countCriticalAlerts()).thenReturn(5L);

        Health health = healthIndicator.health();

        assertNotNull(health);
        assertEquals(Status.DOWN, health.getStatus());
        assertEquals("Más del 20% de productos en alerta crítica", health.getDetails().get("message"));
    }

    @Test
    void health_AtThreshold_ReturnsUp() {
        when(alertService.countTotalProducts()).thenReturn(100L);
        when(alertService.countTotalAlerts()).thenReturn(10L);
        when(alertService.countCriticalAlerts()).thenReturn(2L);

        Health health = healthIndicator.health();

        assertNotNull(health);
        assertEquals(Status.UP, health.getStatus());
    }
}