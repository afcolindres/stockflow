package com.stockflow.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class ProductRequestDto {

    @NotBlank(message = "SKU is required")
    @Size(max = 50, message = "SKU must be at most 50 characters")
    private String sku;

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must be at most 255 characters")
    private String name;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must be at most 100 characters")
    private String category;

    @NotNull(message = "Current stock is required")
    @Min(value = 0, message = "Current stock must be at least 0")
    private Integer currentStock;

    @NotNull(message = "Min stock is required")
    @Min(value = 0, message = "Min stock must be at least 0")
    private Integer minStock;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.01", message = "Unit price must be at least 0.01")
    @DecimalMax(value = "999999.99", message = "Unit price must be at most 999999.99")
    private BigDecimal unitPrice;

    public ProductRequestDto() {
    }

    public ProductRequestDto(String sku, String name, String category, Integer currentStock, Integer minStock, BigDecimal unitPrice) {
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.currentStock = currentStock;
        this.minStock = minStock;
        this.unitPrice = unitPrice;
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