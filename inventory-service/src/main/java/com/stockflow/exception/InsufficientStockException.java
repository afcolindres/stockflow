package com.stockflow.exception;

public class InsufficientStockException extends RuntimeException {

    public InsufficientStockException(String message) {
        super(message);
    }

    public InsufficientStockException(Long productId, Integer requested, Integer available) {
        super("Stock insuficiente para el producto ID " + productId + ". Solicitado: " + requested + ", Disponible: " + available);
    }
}