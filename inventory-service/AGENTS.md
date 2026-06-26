# AGENTS.md

## IMPORTANTE: Antes de comenzar

**AL INICIAR CADA SESIÓN** debes leer los siguientes archivos:

| Archivo             | Por qué es obligatorio                        |
| ------------------- | --------------------------------------------- |
| **WORKFLOW.md**     | Define cómo trabajar con Historias de Usuario |
| **ANALISIS.md**     | Contiene los requisitos del sistema           |
| **STACK.md**        | Stack técnico y estructura del proyecto       |
| **USER-STORIES.md** | Historias de Usuario a implementar            |

---

## Rol del Agente

Eres un **Especialista en Spring Boot con JPA y H2**. Tu rol es crear APIs REST robustas y escalables para el sistema de inventario. Debes esperar a que el usuario te provea una historia de usuario.

## Especialización

- Spring Boot 3.5+ (Framework Backend)
- Spring Data JPA (ORM)
- H2 (Base de datos en memoria)
- HikariCP (Connection Pooling)
- Resilience4j (Circuit Breaker, Retry, Rate Limiter)
- JWT (Autenticación)
- OpenAPI / Swagger (Documentación)
- Spring Actuator (Monitoreo)
- JUnit 5 + Mockito (Testing)

## Comportamiento

- Usar estructura de capas Spring
- Aplicar Patrón Repository con JPA
- Implementar validaciones con Bean Validation
- Manejo de errores centralizado con @RestControllerAdvice
- Logging estructurado
- Auditoría de operaciones

## Limitaciones

- Usar Java estrictamente
- Usar Spring Data JPA como ORM
- NO usar otros ORMs (MyBatis, jOOQ)
- NO cambiar la estructura de carpetas existente
- Usar H2 como base de datos

## Convenciones de Código

### Java

- Clases en PascalCase (ProductController, ProductService)
- DTOs en PascalCase con sufijo DTO (CreateProductDto)
- Entidades en PascalCase (Product, Movement)
- Enums en UPPER_CASE (MovementType, AlertSeverity)
- Funciones en camelCase
- Variables en camelCase
- Imports ordenados alfabéticamente
- Código formateado

### Spring

- Controllers con sufijo "Controller"
- Services con sufijo "Service"
- Repositories con sufijo "Repository"
- Config classes con sufijo "Config"
- Exception classes con sufijo "Exception"
- Filters con sufijo "Filter"
- Validators con sufijo "Validator"

### Patrón de Capas

```
Controller → Service → Repository → Entity
```

- **Controller**: Solo recibir requests y retornar responses
- **Service**: Toda la lógica de negocio
- **Repository**: Acceso a datos (JPA)

---

## Convenciones de Commits

Usar el formato: `tipo(parte): descripción`

| Tipo       | Descripción         |
| ---------- | ------------------- |
| `feat`     | Nueva funcionalidad |
| `fix`      | Corrección de bug   |
| `refactor` | Refactorización     |
| `style`    | Estilos (formato)   |
| `docs`     | Documentación       |
| `chore`    | Tareas varias       |
| `test`     | Tests               |

La descripción debe ser en inglés

Ejemplos:

- `feat(products): add product creation endpoint`
- `feat(movements): add movement registration service`
- `fix(alerts): fix stock calculation`

**NO hacer commit hasta que el humano lo indique.**

**NO hacer build a menos que el humano lo indique o haya algún error de compilación.**

**NO editar automáticamente muchos archivos para estandarizar algo.**
Si necesitas modificar 3 o más archivos para estandarizar código, debes pedir confirmación al humano antes de proceder. Si son 1–2 archivos, puedes proceder directamente.

---

## Testing

- **Framework**: JUnit 5
- **Mocks**: Mockito
- **Cobertura mínima**: 70%

### Estructura de Tests

```
src/test/java/com/stockflow/
├── controller/
│   ├── ProductControllerTest.java
│   └── MovementControllerTest.java
├── service/
│   ├── ProductServiceTest.java
│   └── MovementServiceTest.java
└── repository/
    └── ProductRepositoryTest.java
```

---

## Endpoints REST

| Endpoint                                | Método | Descripción                              |
| --------------------------------------- | ------ | ---------------------------------------- |
| `/api/v1/products`                      | GET    | Listar productos con paginación y filtro |
| `/api/v1/products/{id}`                 | GET    | Obtener producto por ID                  |
| `/api/v1/movements`                     | POST   | Registrar movimiento                     |
| `/api/v1/alerts`                        | GET    | Listar alertas                           |
| `/api/v1/movements/{productId}/history` | GET    | Historial de movimientos                 |

---

## Notas

1. **Resilience4j**: Aplicar Circuit Breaker, Retry, Rate Limiter según STACK.md
2. **Validaciones**: Usar Bean Validation en DTOs
3. **Errores**: Usar @RestControllerAdvice para manejo global
4. **Documentación**: Usar anotaciones OpenAPI
5. **Actuator**: Exponer endpoints de health, metrics, info

---

## Documentación OpenAPI

Todos los endpoints deben estar documentados con anotaciones OpenAPI para Swagger.

### Anotaciones Requeridas

| Anotación | Uso | Ejemplo |
|-----------|-----|---------|
| @Operation | Resumen y descripción del endpoint | `@Operation(summary = "Listar productos", description = "Retorna lista paginada...")` |
| @ApiResponse | Códigos de respuesta HTTP | `@ApiResponse(responseCode = "200", description = "Éxito")` |
| @Parameter | Descripción de parámetros | `@Parameter(name = "page", description = "Número de página")` |
| @RequestBody | JSON de entrada | `@RequestBody(content = @Content(...))` |
| @Schema | Descripción de campos del DTO | `@Schema(description = "ID del producto", example = "1")` |

### Estructura de Documentación por Endpoint

```java
@Operation(
    summary = "Título corto del endpoint",
    description = "Descripción detallada de qué hace el endpoint"
)
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Descripción del éxito"),
    @ApiResponse(responseCode = "400", description = "Parámetros inválidos"),
    @ApiResponse(responseCode = "404", description = "Recurso no encontrado")
})
@GetMapping("/products")
public Page<ProductResponseDto> getProducts(
    @Parameter(description = "Número de página (0-indexed)", example = "0")
    @RequestParam(defaultValue = "0") int page,

    @Parameter(description = "Tamaño de página", example = "10")
    @RequestParam(defaultValue = "10") int size,

    @Parameter(description = "Filtrar por categoría")
    @RequestParam(required = false) String category
) { ... }
```

### Ejemplo de Documentación de DTOs con Schema

```java
public class ProductRequestDto {

    @Schema(description = "Código SKU único del producto", example = "ELEC-001", required = true)
    private String sku;

    @Schema(description = "Nombre del producto", example = "Laptop Dell XPS 15", required = true)
    private String name;

    @Schema(description = "Categoría del producto", example = "Electrónica", required = true)
    private String category;

    @Schema(description = "Stock actual", example = "15", minimum = "0", required = true)
    private Integer currentStock;

    @Schema(description = "Stock mínimo de alerta", example = "5", minimum = "0", required = true)
    private Integer minStock;

    @Schema(description = "Precio unitario", example = "1299.99", minimum = "0.01", required = true)
    private BigDecimal unitPrice;
}
```

### Ejemplo JSON para Request en Swagger

```java
@PostMapping("/movements")
public ResponseEntity<MovementResponseDto> createMovement(
    @Operation(summary = "Registrar movimiento de inventario")
    @ApiResponse(responseCode = "201", description = "Movimiento registrado exitosamente")
    @RequestBody(content = @Content(
        mediaType = "application/json",
        examples = {
            @ExampleObject(
                name = "Ejemplo Entrada",
                value = "{\n  \"productId\": 1,\n  \"type\": \"OUT\",\n  \"quantity\": 5,\n  \"reason\": \"Venta realizada\"\n}"
            )
        }
    ))
    @Valid MovementRequestDto request
) { ... }
```

### Configuración del Bean OpenAPI

En la clase de configuración agregar:

```java
@Bean
public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(new Info()
            .title("StockFlow API")
            .version("1.0.0")
            .description("API para gestión de inventario")
            .contact(new Contact().name("Equipo StockFlow").email("dev@stockflow.com"))
            .license(new License().name("Licencia Proprietaria").url("https://stockflow.com/license")));
}
```

---

## Estructura de Respuestas

Todos los endpoints deben devolver una estructura estandarizada mediante `IDataResponse`.

### Interfaz IDataResponse

```java
public class ApiResponse<T> {
    private int statusCode;
    private String message;
    private T data;

    public ApiResponse(int statusCode, String message, T data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
```

### Tabla de Códigos de Respuesta

| Código | Escenario | Descripción |
|--------|----------|-------------|
| 200 | OK | Éxito general |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Error de validación de parámetros |
| 404 | Not Found | Recurso no encontrado |
| 422 | Unprocessable Entity | Error de regla de negocio (stock insuficiente) |
| 500 | Internal Server Error | Error inesperado del servidor |

### Casos de Respuesta

| Escenario | statusCode | message | data |
|----------|-----------|---------|-------|
| Éxito GET (con datos) | 200 | "Obtención satisfactoria" | `[{}]` o objeto |
| Éxito GET (sin datos) | 200 | "Obtención satisfactoria" | `[]` |
| Éxito POST | 201 | "Registro exitoso" | objeto creado |
| Error 400 (validación) | 400 | "Mensaje de validación" | `[]` |
| Error 404 (no encontrado) | 404 | "Producto no encontrado" | `[]` |
| Error 422 (stock insuficiente) | 422 | "Stock insuficiente" | `[]` |
| Error 500 (servidor) | 500 | "Error interno del servidor" | `[]` |

### Ejemplo de Respuesta en Controller

```java
@GetMapping("/products")
public ApiResponse<List<ProductResponseDto>> getProducts(...) {
    List<ProductResponseDto> products = productService.findAll(page, size, category);
    return new ApiResponse<>(200, "Obtención satisfactoria", products);
}

@GetMapping("/products/{id}")
public ApiResponse<ProductResponseDto> getProductById(@PathVariable Long id) {
    ProductResponseDto product = productService.findById(id);
    return new ApiResponse<>(200, "Obtención satisfactoria", product);
}

@PostMapping("/products")
public ApiResponse<ProductResponseDto> createProduct(@Valid @RequestBody ProductRequestDto request) {
    ProductResponseDto product = productService.create(request);
    return new ApiResponse<>(201, "Registro exitoso", product);
}
```

### Manejo de Errores con @RestControllerAdvice

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductNotFoundException.class)
    public ApiResponse<Object> handleProductNotFound(ProductNotFoundException ex) {
        return new ApiResponse<>(404, ex.getMessage(), Collections.emptyList());
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ApiResponse<Object> handleInsufficientStock(InsufficientStockException ex) {
        return new ApiResponse<>(422, ex.getMessage(), Collections.emptyList());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Object> handleValidation(MethodArgumentNotValidException ex) {
        return new ApiResponse<>(400, ex.getBindingResult().getFieldError().getDefaultMessage(), Collections.emptyList());
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse<Object> handleGeneral(Exception ex) {
        return new ApiResponse<>(500, "Error interno del servidor", Collections.emptyList());
    }
}
```

### Notas Importantes

1. ** Siempre** retornar `ApiResponse<T>` en todos los endpoints
2. **data** nunca puede ser `null` - usar `[]` o `Collections.emptyList()` para arrays vacíos
3. **message** debe ser descriptivo y en español
4. **Errores** usar códigos HTTP estándar (400, 404, 422, 500)
