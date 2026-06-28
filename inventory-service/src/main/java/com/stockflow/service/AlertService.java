package com.stockflow.service;

import com.stockflow.dto.StockAlertResponseDto;
import com.stockflow.entity.AlertSeverity;
import com.stockflow.entity.Product;
import com.stockflow.repository.ProductRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    private static final Logger logger = LoggerFactory.getLogger(AlertService.class);

    private final ProductRepository productRepository;

    public AlertService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @CircuitBreaker(name = "alertService", fallbackMethod = "getAlertsFallback")
    public List<StockAlertResponseDto> getAlerts() {
        logger.info("Fetching stock alerts");

        List<Product> products = productRepository.findAll();

        List<StockAlertResponseDto> alerts = products.stream()
                .filter(p -> p.getCurrentStock() <= p.getMinStock())
                .map(this::toAlertDto)
                .collect(Collectors.toList());

        logger.info("Found {} alerts", alerts.size());
        return alerts;
    }

    private StockAlertResponseDto toAlertDto(Product product) {
        AlertSeverity severity = calculateSeverity(product.getCurrentStock(), product.getMinStock());
        return new StockAlertResponseDto(
                product.getId(),
                product.getName(),
                product.getCurrentStock(),
                product.getMinStock(),
                severity
        );
    }

    private AlertSeverity calculateSeverity(Integer currentStock, Integer minStock) {
        if (currentStock >= (minStock * 0.5)) {
            return AlertSeverity.LOW;
        } else {
            return AlertSeverity.CRITICAL;
        }
    }

    @SuppressWarnings("unused")
    private List<StockAlertResponseDto> getAlertsFallback(Exception ex) {
        logger.warn("Circuit breaker fallback triggered: {}", ex.getMessage());
        return Collections.emptyList();
    }

    public long countCriticalAlerts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .filter(p -> p.getCurrentStock() <= p.getMinStock())
                .filter(p -> p.getCurrentStock() < (p.getMinStock() * 0.5))
                .count();
    }

    public long countTotalAlerts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .filter(p -> p.getCurrentStock() <= p.getMinStock())
                .count();
    }

    public long countTotalProducts() {
        return productRepository.count();
    }
}