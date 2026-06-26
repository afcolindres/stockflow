package com.stockflow.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sku", nullable = false, unique = true, length = 50)
    private String sku;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Column(name = "current_stock", nullable = false)
    private Integer currentStock = 0;

    @Column(name = "min_stock", nullable = false)
    private Integer minStock = 0;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Movement> movements = new ArrayList<>();

    public Product() {
    }

    public Product(String sku, String name, String category, Integer currentStock, Integer minStock, BigDecimal unitPrice) {
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

    public List<Movement> getMovements() {
        return movements;
    }

    public void setMovements(List<Movement> movements) {
        this.movements = movements;
    }

    public void addMovement(Movement movement) {
        movements.add(movement);
        movement.setProduct(this);
    }

    public void removeMovement(Movement movement) {
        movements.remove(movement);
        movement.setProduct(null);
    }
}