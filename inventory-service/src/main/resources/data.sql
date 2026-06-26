-- Initial data for StockFlow Inventory Service
-- 10+ products in at least 3 categories

-- Category: Electrónica (4 products)
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ELEC-001', 'Laptop Dell XPS 15', 'Electrónica', 15, 5, 1299.99);
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ELEC-002', 'Monitor Samsung 27"', 'Electrónica', 8, 3, 349.99);
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ELEC-003', 'Teclado Mecánico RGB', 'Electrónica', 25, 10, 89.99);
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ELEC-004', 'Mouse Inalámbrico', 'Electrónica', 30, 15, 29.99);

-- Category: Ropa (4 products)
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ROPA-001', 'Camisa Casual Manga Larga', 'Ropa', 50, 20, 39.99);
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ROPA-002', 'Pantalón Jeans Slim', 'Ropa', 35, 15, 59.99);
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ROPA-003', 'Chaqueta de Cuero', 'Ropa', 12, 5, 199.99);
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ROPA-004', 'Zapatos Formales', 'Ropa', 20, 10, 89.99);

-- Category: Alimentos (4 products)
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ALIM-001', 'Arroz Integral 1kg', 'Alimentos', 100, 30, 2.49);
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ALIM-002', 'Frijoles Negros 500g', 'Alimentos', 80, 25, 1.99);
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ALIM-003', 'Aceite de Oliva 1L', 'Alimentos', 40, 15, 8.99);
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('ALIM-004', 'Pasta de Tomate 400g', 'Alimentos', 60, 20, 1.49);

-- Additional products for variety (3 more products)
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('HOG-001', 'Toallas de Baño (Pack 2)', 'Hogar', 45, 20, 14.99);
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('DEP-001', 'Balón de Fútbol', 'Deportes', 18, 8, 24.99);
INSERT INTO product (sku, name, category, current_stock, min_stock, unit_price) VALUES ('LIB-001', 'Novela: El Principito', 'Libros', 22, 10, 12.99);