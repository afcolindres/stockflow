# USER-STORIES.md - Historias de Usuario

## Historial de US

| US     | Título                                   | Complejidad | Estado     |
| ------ | ---------------------------------------- | ----------- | ---------- |
| US-001 | Configuración del Modelo de Datos        | 3           | completada |
| US-002 | Listar Productos con Paginación y Filtro | 2           | completada |
| US-003 | Obtener Detalle de un Producto           | 1           | Pendiente  |
| US-004 | Registrar Movimiento de Inventario       | 3           | Pendiente  |
| US-005 | Consultar Alertas de Stock               | 2           | Pendiente  |
| US-006 | Historial de Movimientos por Producto    | 2           | Pendiente  |

---

## US-001: Configuración del Modelo de Datos

### Descripción

Como desarrollador, quiero configurar el modelo de datos del sistema para establecer la base de la gestión de inventario.

### Criterios de Aceptación

- [x] Definir entidad Product con campos: id, sku, name, category, currentStock, minStock, unitPrice
- [x] Definir entidad Movement con campos: id, productId, type[IN/OUT], quantity, reason, timestamp
- [x] Configurar relación uno a muchos entre Product y Movement
- [x] Implementar validaciones Bean Validation en DTOs (@NotNull, @NotBlank, @Min, @Max)
- [x] Configurar HikariCP con parámetros adecuados (maximum-pool-size, minimum-idle, connection-timeout, idle-timeout)
- [x] Crear datos iniciales mediante data.sql con mínimo 10 productos en al menos 3 categorías
- [x] Separar correctamente las capas: Controller -> Service -> Repository

### Estimación

| Complejidad | 3 |
| Tiempo estimado | 4 horas |

### Ideas de Test

- [ ] Verificar creación de entidad Product
- [ ] Verificar creación de entidad Movement
- [ ] Verificar relación Product -> Movements
- [ ] Verificar validación de DTOs
- [ ] Verificar carga de datos iniciales

### Notas Técnicas

- Entidades: `com.stockflow.entity.Product`, `com.stockflow.entity.Movement`
- Repositorios: `com.stockflow.repository.ProductRepository`, `com.stockflow.repository.MovementRepository`
- Configuración HikariCP en application.yml
- data.sql en src/main/resources/

### Bloqueos

Ninguno - Es la base del proyecto

---

## US-002: Listar Productos con Paginación y Filtro

### Descripción

Como usuario del sistema, quiero listar productos con paginación y filtro por categoría para explorar el catálogo de inventario.

### Criterios de Aceptación

- [x] Listar todos los productos con paginación
- [x] Filtrar productos por categoría
- [x] Soportar parámetros de página (page, size)
- [x] Retornar metadatos de paginación (totalElements, totalPages, currentPage)
- [x] Documentar endpoint con OpenAPI (@Operation, @ApiResponse, @Schema)
- [x] Exponer endpoint en /actuator/health, /actuator/metrics, /actuator/info

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 3 horas |

### Ideas de Test

- [ ] Verificar paginación por defecto
- [ ] Verificar cambio de tamaño de página
- [ ] Verificar filtro por categoría existente
- [ ] Verificar filtro por categoría sin resultados
- [ ] Verificar respuesta de metadatos de paginación

### Notas Técnicas

- Endpoint: GET `/api/v1/products`
- Parámetros: `page` (default 0), `size` (default 10), `category` (opcional)
- Servicio: `com.stockflow.service.ProductService`
- DTOs: `ProductResponseDto`, `PageResponseDto`

### Bloqueos

Requiere US-001 completa (modelo de datos configurado)

---

## US-003: Obtener Detalle de un Producto

### Descripción

Como usuario del sistema, quiero obtener el detalle de un producto específico para visualizar toda su información.

### Criterios de Aceptación

- [ ] Obtener producto por ID
- [ ] Retornar 404 si producto no existe (ProductNotFoundException)
- [ ] Mostrar información completa: id, sku, name, category, currentStock, minStock, unitPrice
- [ ] Documentar endpoint con OpenAPI
- [ ] Manejo global de excepciones con @RestControllerAdvice
- [ ] Retornar ErrorResponse consistente: { timestamp, status, error, message, path }

### Estimación

| Complejidad | 1 |
| Tiempo estimado | 2 horas |

### Ideas de Test

- [ ] Verificar obtención por ID existente
- [ ] Verificar respuesta 404 para ID inexistente
- [ ] Verificar estructura del response

### Notas Técnicas

- Endpoint: GET `/api/v1/products/{id}`
- Excepción: `ProductNotFoundException` (código 404)
- Clase: `com.stockflow.exception.ProductNotFoundException`

### Bloqueos

Requiere US-001 completa

---

## US-004: Registrar Movimiento de Inventario

### Descripción

Como usuario del sistema, quiero registrar movimientos de inventario (entradas y salidas) para mantener el stock actualizado y generar alertas.

### Criterios de Aceptación

- [ ] Registrar movimiento de entrada (IN) sumándole al stock
- [ ] Registrar movimiento de salida (OUT) restándole al stock
- [ ] Validar stock suficiente para salidas (InsufficientStockException código 422)
- [ ] Actualizar automáticamente el currentStock del producto al registrar
- [ ] Disparar alerta si el stock cae por debajo del mínimo
- [ ] Configurar Retry con máximo 3 intentos y espera exponencial
- [ ] Documentar endpoint con OpenAPI
- [ ] Validar DTOs con @Valid y anotaciones Bean Validation

### Estimación

| Complejidad | 3 |
| Tiempo estimado | 5 horas |

### Ideas de Test

- [ ] Verificar registro de entrada (IN) aumenta stock
- [ ] Verificar registro de salida (OUT) disminuye stock
- [ ] Verificar validación de stock insuficiente (422)
- [ ] Verificar actualización automática de stock
- [ ] Verificar generación de alerta automática
- [ ] Verificar Retry en fallos

### Notas Técnicas

- Endpoint: POST `/api/v1/movements`
- Servicio: `com.stockflow.service.MovementService`
- DTOs: `MovementRequestDto`, `MovementResponseDto`
- Resilience4j: Retry configurado en application.yml
- Excepción: `InsufficientStockException` (código 422)

### Flujo Principal a Validar

> Registrar un movimiento de salida → actualizar el stock del producto → disparar una alerta si el stock cae por debajo del mínimo.

### Bloqueos

Requiere US-001 completas

---

## US-005: Consultar Alertas de Stock

### Descripción

Como usuario del sistema, quiero consultar los productos con stock bajo el mínimo para tomar acciones correctivas.

### Criterios de Aceptación

- [ ] Listar productos con currentStock <= minStock
- [ ] Calcular severidad LOW si stock >= 50% del mínimo
- [ ] Calcular severidad CRITICAL si stock < 50% del mínimo
- [ ] Aplicar Circuit Breaker sobre el servicio de alertas
- [ ] Implementar fallback que retorne lista vacía con mensaje descriptivo
- [ ] Implementar Health Indicator personalizado (>20% productos en alerta crítica = DOWN)
- [ ] Documentar endpoint con OpenAPI
- [ ] Configurar Circuit Breaker en application.yml

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 3 horas |

### Ideas de Test

- [ ] Verificar listado de alertas
- [ ] Verificar severidad LOW cálculo correcto
- [ ] Verificar severidad CRITICAL cálculo correcto
- [ ] Verificar fallback de Circuit Breaker
- [ ] Verificar Health Indicator personalizado

### Notas Técnicas

- Endpoint: GET `/api/v1/alerts`
- Servicio: `com.stockflow.service.AlertService`
- DTOs: `StockAlertResponseDto`
- Resilience4j: Circuit Breaker configurado en application.yml
- Health Indicator: verifica >20% alertas críticas

### Bloqueos

Requiere US-001 completa

---

## US-006: Historial de Movimientos por Producto

### Descripción

Como usuario del sistema, quiero consultar el historial de movimientos de un producto específico para auditoría y seguimiento.

### Criterios de Aceptación

- [ ] Consultar historial de movimientos por productId
- [ ] Ordenar por timestamp descendente (más reciente primero)
- [ ] Aplicar Rate Limiter de 10 peticiones por segundo
- [ ] Soportar paginación en el historial
- [ ] Documentar endpoint con OpenAPI
- [ ] Configurar Rate Limiter en application.yml

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 2 horas |

### Ideas de Test

- [ ] Verificar consulta de historial por producto
- [ ] Verificar ordenamiento descendente
- [ ] Verificar Rate Limiter (bloquea após 10 req/s)
- [ ] Verificar paginación del historial

### Notas Técnicas

- Endpoint: GET `/api/v1/movements/{productId}/history`
- Rate Limiter: 10 peticiones por segundo
- Servicio: `com.stockflow.service.MovementService`
- Resilience4j: Rate Limiter configurado en application.yml

### Bloqueos

Requiere US-004 completa (movimientos registrados)

---

## Estados de US

| Estado     | Descripción            |
| ---------- | ---------------------- |
| Pendiente  | No iniciada            |
| En Proceso | En desarrollo          |
| Completada | Terminada              |
| Cancelada  | Cancelada por bloqueos |
