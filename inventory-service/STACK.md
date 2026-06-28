# STACK.md - Stack Técnico inventory-service

## Tecnologías

- **Backend**: Spring Boot 3.5.0
- **Framework**: Spring Web (REST)
- **ORM**: Spring Data JPA / Hibernate
- **Base de datos**: H2 (en memoria)
- **Connection Pooling**: HikariCP
- **Resilience**: Resilience4j (Circuit Breaker, Retry, Rate Limiter)
- **Documentación**: OpenAPI / Swagger
- **Actuator**: Spring Boot Actuator
- **Testing**: JUnit 5, Mockito
- **Build**: Maven
- **Java**: 17

---

## Dependencias Principales

### Core

- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-validation`
- `spring-boot-starter-actuator`

### Database

- `h2` (runtime)
- `spring-jdbc`

### Resilience

- `resilience4j-spring-boot3`
- `resilience4j-circuitbreaker`
- `resilience4j-retry`
- `resilience4j-ratelimiter`

### Documentation

- `springdoc-openapi-starter-webmvc-ui`

### Testing

- `spring-boot-starter-test`
- `h2` (test)

---

## Estructura del Proyecto

```
inventory-service/
├── src/
│   ├── main/
│   │   ├── java/com/stockflow/
│   │   │   ├── controller/      # Controladores REST
│   │   │   ├── service/         # Lógica de negocio
│   │   │   ├── repository/     # Repositorios JPA
│   │   │   ├── entity/          # Entidades JPA
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── exception/      # Excepciones personalizadas
│   │   │   └── config/         # Configuración
│   │   └── resources/
│   │       ├── application.yml # Configuración
│   │       ├── data.sql        # Datos iniciales
│   │       └── schema.sql     # Esquema H2
│   └── test/
│       └── java/              # Tests
├── pom.xml
└── README.md
```

---

## Entidades de Dominio

### Product

| Campo        | Tipo       | Descripción         |
| ------------ | ---------- | ------------------- |
| id           | Long       | Identificador único |
| sku          | String     | Código SKU          |
| name         | String     | Nombre del producto |
| category     | String     | Categoría           |
| currentStock | Integer    | Stock actual        |
| minStock     | Integer    | Stock mínimo        |
| unitPrice    | BigDecimal | Precio unitario     |
| movements    | List<Movement> | Relación OneToMany |

### Movement

| Campo     | Tipo          | Descripción                 |
| --------- | ------------- | --------------------------- |
| id        | Long          | Identificador único         |
| product   | Product      | Relación ManyToOne         |
| type      | Enum         | IN (entrada) / OUT (salida) |
| quantity  | Integer       | Cantidad                    |
| reason    | String        | Razón del movimiento        |
| timestamp | LocalDateTime | Fecha y hora                |

### AlertSeverity (Enum)

| Valor     | Descripción         |
| ---------- | ------------------- |
| LOW       | Stock bajo mínimo  |
| CRITICAL | Stock <= minStock/2 |

### MovementType (Enum)

| Valor | Descripción         |
| ------ | ------------------- |
| IN    | Entrada de stock    |
| OUT   | Salida de stock     |

---

## Endpoints REST

| Endpoint                                | Método | Descripción                                            |
| --------------------------------------- | ------ | ------------------------------------------------------ |
| `/api/v1/products`                      | GET    | Listar productos con paginación y filtro por categoría |
| `/api/v1/products/{id}`                 | GET    | Obtener detalle de un producto                         |
| `/api/v1/categories`                    | GET    | Listar todas las categorías disponibles               |
| `/api/v1/products/search`              | GET    | Buscar productos por texto                            |
| `/api/v1/products/{id}/stats`           | GET    | Obtener estadísticas de producto                      |
| `/api/v1/movements`                     | POST   | Registrar movimiento (actualiza stock automáticamente) |
| `/api/v1/movements/{productId}/history` | GET    | Historial de movimientos por producto                  |
| `/api/v1/alerts`                        | GET    | Retornar productos con stock actual <= minStock        |

---

## Configuración HikariCP

Parámetros de Connection Pooling en `application.yml`:

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
```

---

## Resilience4j

### Circuit Breaker

- Aplicado al endpoint `/api/v1/alerts`
- Fallback: retorna lista vacía con mensaje descriptivo

### Retry

- Máximo 3 intentos
- Espera exponencial
- Aplicado al registro de movimientos

### Rate Limiter

- 10 peticiones por segundo
- Aplicado al historial de movimientos

---

## Spring Actuator

Endpoints expuestos:

- `/actuator/health` - Estado de salud
- `/actuator/metrics` - Métricas
- `/actuator/info` - Información del servicio

### Health Indicator Personalizado

Verifica si más del 20% de productos están en alerta crítica.
Si es así, reporta estado DOWN con porcentaje.

---

## OpenAPI / Swagger

- Documentación en `/swagger-ui.html`
- Anotaciones: @Operation, @ApiResponse, @Schema
- Bean OpenAPI con información de contacto y licencia

---

## Flujo Principal

```
1. Registrar movimiento de salida
2. Actualizar stock del producto
3. Disparar alerta si stock < minStock
```

---

## Testing

- **Framework**: JUnit 5
- **Mocks**: Mockito
- **Cobertura mínima**: 70%
- **Tests unitarios**: `src/test/java/com/stockflow/`
- **Tests de integración**: carpeta dedicada en test

---

## Comandos

```bash
# Desarrollo
mvn spring-boot:run

# Build
mvn clean package

# Test
mvn test
mvn test -Dcoverage

# Test con cobertura
mvn test -Dsurefire.useFile=false
```

---

## Puertos y Variables de Entorno

- **Puerto default**: 8080
- **H2 Console**: `/h2-console` (solo desarrollo)

---

## Convenciones de Código

### Java

- Clases en PascalCase
- Interfaces con prefijo "I" cuando aplica
- DTOs con sufijo "Dto"
- Enums en UPPER_CASE

### Spring

- Controllers con sufijo "Controller"
- Services con sufijo "Service"
- Repositories con sufijo "Repository"
- @RestControllerAdvice para manejo global

### Capas

- **Controller**: Solo recibir requests y responses
- **Service**: Lógica de negocio
- **Repository**: Acceso a datos

---

## Notas

1. **H2**: Base de datos en memoria para evaluación
2. **Resilience4j**: Tolerancia a fallos
3. **Actuator**: Monitoreo y health checks
4. **Swagger**: Documentación automática
5. **Validaciones**: Bean Validation en DTOs
