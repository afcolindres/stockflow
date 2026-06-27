package com.stockflow.dto;

import com.stockflow.entity.AlertSeverity;

public class StockAlertResponseDto {

    private Long productId;
    private String productName;
    private Integer currentStock;
    private Integer minStock;
    private AlertSeverity severity;

    public StockAlertResponseDto() {
    }

    public StockAlertResponseDto(Long productId, String productName, Integer currentStock, Integer minStock, AlertSeverity severity) {
        this.productId = productId;
        this.productName = productName;
        this.currentStock = currentStock;
        this.minStock = minStock;
        this.severity = severity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Integer getMinStock() {
        return minStock;
    }

    public void setMinStock(Integer minStock) {
        this.minStock = minStock;
    }

    public AlertSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(AlertSeverity severity) {
        this.severity = severity;
    }
}