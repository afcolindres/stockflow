package com.stockflow.config;

import com.stockflow.service.AlertService;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class InventoryHealthIndicator implements HealthIndicator {

    private static final double CRITICAL_THRESHOLD = 0.20;

    private final AlertService alertService;

    public InventoryHealthIndicator(AlertService alertService) {
        this.alertService = alertService;
    }

    @Override
    public Health health() {
        long totalProducts = alertService.countTotalProducts();
        long totalAlerts = alertService.countTotalAlerts();
        long criticalAlerts = alertService.countCriticalAlerts();

        if (totalProducts == 0) {
            return Health.up()
                    .withDetail("message", "No hay productos registrados")
                    .build();
        }

        double criticalPercentage = (double) criticalAlerts / totalProducts;

        if (criticalPercentage > CRITICAL_THRESHOLD) {
            return Health.down()
                    .withDetail("criticalAlerts", criticalAlerts)
                    .withDetail("totalProducts", totalProducts)
                    .withDetail("criticalPercentage", String.format("%.1f%%", criticalPercentage * 100))
                    .withDetail("message", "Más del 20% de productos en alerta crítica")
                    .build();
        }

        return Health.up()
                .withDetail("criticalAlerts", criticalAlerts)
                .withDetail("totalAlerts", totalAlerts)
                .withDetail("totalProducts", totalProducts)
                .build();
    }
}