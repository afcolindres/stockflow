package com.stockflow.dto;

import java.math.BigDecimal;

public class ProductResponseDto {

    private Long id;
    private String sku;
    private String name;
    private String category;
    private Integer currentStock;
    private Integer minStock;
    private BigDecimal unitPrice;

    public ProductResponseDto() {
    }

    public ProductResponseDto(Long id, String sku, String name, String category, Integer currentStock, Integer minStock, BigDecimal unitPrice) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.currentStock = currentStock;
        this.minStock = minStock;
        this.unitPrice = unitPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }
}