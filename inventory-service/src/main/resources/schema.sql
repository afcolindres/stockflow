-- Schema for StockFlow Inventory Service
-- H2 Database

DROP TABLE IF EXISTS movement;
DROP TABLE IF EXISTS product;

CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    current_stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE movement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    type VARCHAR(3) NOT NULL,
    quantity INT NOT NULL,
    reason VARCHAR(255),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movement_product FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE INDEX idx_product_category ON product(category);
CREATE INDEX idx_movement_product_id ON movement(product_id);
CREATE INDEX idx_movement_timestamp ON movement(timestamp);