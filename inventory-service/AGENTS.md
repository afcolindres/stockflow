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
