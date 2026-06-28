package com.stockflow.dto;

import java.time.LocalDateTime;

public class ProductStatsResponseDto {

    private Long productId;
    private String productName;
    private Long totalMovements;
    private Long totalIn;
    private Long totalOut;
    private Double averagePerMonth;
    private LocalDateTime lastMovement;

    public ProductStatsResponseDto() {
    }

    public ProductStatsResponseDto(Long productId, String productName, Long totalMovements, Long totalIn, Long totalOut, Double averagePerMonth, LocalDateTime lastMovement) {
        this.productId = productId;
        this.productName = productName;
        this.totalMovements = totalMovements;
        this.totalIn = totalIn;
        this.totalOut = totalOut;
        this.averagePerMonth = averagePerMonth;
        this.lastMovement = lastMovement;
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

    public Long getTotalMovements() {
        return totalMovements;
    }

    public void setTotalMovements(Long totalMovements) {
        this.totalMovements = totalMovements;
    }

    public Long getTotalIn() {
        return totalIn;
    }

    public void setTotalIn(Long totalIn) {
        this.totalIn = totalIn;
    }

    public Long getTotalOut() {
        return totalOut;
    }

    public void setTotalOut(Long totalOut) {
        this.totalOut = totalOut;
    }

    public Double getAveragePerMonth() {
        return averagePerMonth;
    }

    public void setAveragePerMonth(Double averagePerMonth) {
        this.averagePerMonth = averagePerMonth;
    }

    public LocalDateTime getLastMovement() {
        return lastMovement;
    }

    public void setLastMovement(LocalDateTime lastMovement) {
        this.lastMovement = lastMovement;
    }
}