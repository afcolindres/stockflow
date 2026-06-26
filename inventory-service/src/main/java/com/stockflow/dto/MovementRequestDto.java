package com.stockflow.dto;

import com.stockflow.entity.MovementType;
import jakarta.validation.constraints.*;

public class MovementRequestDto {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Movement type is required")
    private MovementType type;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 999999, message = "Quantity must be at most 999999")
    private Integer quantity;

    @Size(max = 255, message = "Reason must be at most 255 characters")
    private String reason;

    public MovementRequestDto() {
    }

    public MovementRequestDto(Long productId, MovementType type, Integer quantity, String reason) {
        this.productId = productId;
        this.type = type;
        this.quantity = quantity;
        this.reason = reason;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public MovementType getType() {
        return type;
    }

    public void setType(MovementType type) {
        this.type = type;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}