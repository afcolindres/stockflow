# ANALISIS.md - Análisis de inventory-service

## 1. Requisitos del Sistema

### Requisitos Funcionales

- **Gestión de Productos**: Listado con paginación, filtro por categoría, búsqueda por texto
- **Gestión de Categorías**: Listado de todas las categorías disponibles
- **Registro de Movimientos**: Entradas (IN) y salidas (OUT) de inventario
- **Actualización Automática de Stock**: Al registrar movimiento
- **Generación de Alertas**: Stock bajo y crítico (con severidad)
- **Historial de Movimientos**: Consulta paginada por producto
- **Estadísticas de Producto**: Total movimientos, entradas, salidas, promedio mensual

### Requisitos No Funcionales

- **Rendimiento**: Tiempo de respuesta aceptable
- **Tolerancia a fallos**: Resilience4j (Circuit Breaker, Retry, Rate Limiter)
- **Documentación**: OpenAPI / Swagger
- **Monitoreo**: Spring Actuator con Health Indicator personalizado

---

## 2. Análisis de Viabilidad

### Viabilidad Técnica

- Stack: Spring Boot 3.5+ + H2
- Sin configuración externa requerida

### Viabilidad Operativa

- Sistema de monitoreo de inventario
- Múltiples usuarios (operadores)

---

## 3. Arquitectura y Diseño

### Arquitectura de Capas

```
┌─────────────────────────────────┐
│     Controller (REST API)          │
├─────────────────────────────────┤
│     Service (Lógica negocio)    │
├─────────────────────────────────┤
│     Repository (JPA/Hibernate)   │
├─────────────────────────────────┤
│     Base de datos H2           │
└─────────────────────────────────┘
```

### Componentes Principales

- **ProductController**: Endpoints de productos (listado, búsqueda, categorías, estadísticas)
- **MovementController**: Endpoints de movimientos (registro, historial)
- **AlertController**: Endpoints de alertas
- **ProductService**: Lógica de productos (findAll, findById, findAllCategories, search)
- **MovementService**: Lógica de movimientos (registerMovement, getHistory, getStats)
- **AlertService**: Lógica de alertas (getAlerts, countCriticalAlerts, countTotalAlerts)
- **ProductRepository**: Acceso a datos de productos
- **MovementRepository**: Acceso a datos de movimientos

### Entidades Principales

#### Product

```java
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String sku;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(nullable = false)
    private Integer currentStock;

    @Column(nullable = false)
    private Integer minStock;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;
}
```

#### Movement

```java
@Entity
public class Movement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType type;

    @Column(nullable = false)
    private Integer quantity;

    private String reason;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}

public enum MovementType {
    IN,  // Entrada
    OUT  // Salida
}
```

#### StockAlert

```java
public class StockAlert {
    private Long productId;
    private String productName;
    private Integer currentStock;
    private Integer minStock;
    private AlertSeverity severity;
}

public enum AlertSeverity {
    LOW,      // Stock bajo (entre 50% y 100% del minStock)
    CRITICAL  // Stock crítico (menos del 50% del minStock)
}
```

---

## 4. Gestión de Riesgos

| Riesgo               | Probabilidad | Impacto | Mitigación    |
| -------------------- | ------------ | ------- | ------------- |
| Pérdida de datos     | Baja         | Alto    | H2 en memoria |
| Fallos conectividad  | Baja         | Alto    | Resilience4j  |
| Stock desactualizado | Media        | Medio   | Validaciones  |
| Alta carga           | Media        | Medio   | Rate Limiter  |

---

## 5. Flujo Principal

### Flujo: Registro de Movimiento → Alerta

```
1. Cliente envía POST /api/v1/movements
   {
     "productId": 1,
     "type": "OUT",
     "quantity": 10,
     "reason": "Venta"
   }

2. MovementService.registerMovement()
   - Valida stock disponible (para tipo OUT)
   - Actualiza currentStock en Product
   - Verifica si hay alerta (stock <= minStock)
   - Crea registro en tabla Movement

3. Respuesta al cliente
   - MovementResponseDto con datos del movimiento
   - Alerta incluida si stock bajo (en campo alert)
```

---

## 6. Integraciones

### Sistemas Externos

- **H2**: Base de datos en memoria
- **Swagger UI**: Documentación
- **Actuator**: Monitoreo

### APIs

- REST API para Frontend
- OpenAPI para documentación

---

## 7. Métricas de Éxito

- Endpoints de productos funcionando (listado, búsqueda, categorías, estadísticas)
- Endpoint de registro de movimientos funcionando
- Endpoint de historial de movimientos funcionando
- Endpoint de alertas funcionando
- Circuit Breaker en alertas (fallback)
- Retry en movimientos
- Rate Limiter en historial
- Health Indicator personalizado funcionando

---

## 8. Excepciones Personalizadas

| Excepción                       | HTTP | Descripción            |
| ------------------------------- | ---- | ---------------------- |
| ProductNotFoundException        | 404  | Producto no encontrado |
| InsufficientStockException      | 422  | Stock insuficiente     |
| MethodArgumentNotValidException | 400  | Validación fallida     |
| Exception (genérica)            | 500  | Error interno          |

---

## 9. DTOs

### ProductRequestDto

```java
public class ProductRequestDto {
    @NotBlank(message = "SKU es requerido")
    private String sku;

    @NotBlank(message = "Nombre es requerido")
    private String name;

    private String category;

    @NotNull(message = "Stock actual es requerido")
    @Min(value = 0, message = "Stock no puede ser negativo")
    private Integer currentStock;

    @NotNull(message = "Stock mínimo es requerido")
    @Min(value = 0, message = "Stock mínimo no puede ser negativo")
    private Integer minStock;

    @NotNull(message = "Precio unitario es requerido")
    @DecimalMin(value = "0.01", message = "Precio debe ser mayor a 0")
    private BigDecimal unitPrice;
}
```

### MovementRequestDto

```java
public class MovementRequestDto {
    @NotNull(message = "Producto es requerido")
    private Long productId;

    @NotNull(message = "Tipo de movimiento es requerido")
    private MovementType type;

    @NotNull(message = "Cantidad es requerida")
    @Min(value = 1, message = "Cantidad debe ser mayor a 0")
    private Integer quantity;

    private String reason;
}
```

### MovementResponseDto

```java
public class MovementResponseDto {
    private Long id;
    private Long productId;
    private String productName;
    private MovementType type;
    private Integer quantity;
    private String reason;
    private LocalDateTime timestamp;
    private StockAlertResponseDto alert;  // Alerta incluida si stock bajo
}
```

### StockAlertResponseDto

```java
public class StockAlertResponseDto {
    private Long productId;
    private String productName;
    private Integer currentStock;
    private Integer minStock;
    private AlertSeverity severity;  // LOW o CRITICAL
}
```

### ProductStatsResponseDto

```java
public class ProductStatsResponseDto {
    private Long productId;
    private String productName;
    private Long totalMovements;
    private Long totalIn;
    private Long totalOut;
    private Double averagePerMonth;
    private LocalDateTime lastMovement;
}
```

### ErrorResponse

```java
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
}
```

---

## 10. Datos Iniciales (data.sql)

Mínimo 10 productos distribuidos en al menos 3 categorías:

- Electrónica (laptops, teclados, mouse)
- Redes (routers, switches, cables)
- Accesorios (cámaras, disks, memorias)
