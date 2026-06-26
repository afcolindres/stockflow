# WORKFLOW.md - Flujo de Trabajo con Historias de Usuario

Este documento define cómo trabajar con las Historias de Usuario (US) en el proyecto inventory-service.

---

## Proceso de Desarrollo por US

### 1. Recepción de US

Cuando se asigne una US, esta debe incluir:

- **Título** de la historia
- **Descripción** (Como usuario quiero...)
- **Criterios de aceptación** (Given/When/Then)

### 2. Revisión Previa

Antes de implementar, el agente revisará:

| Archivo              | Propósito                                               |
| -------------------- | ------------------------------------------------------- |
| **ANALISIS.md**      | Requisitos, entidades y casos de uso del negocio      |
| **STACK.md**         | Stack técnico, tecnologías y herramientas           |
| **USER-STORIES.md**  | Las User Stories definidas                           |
| **Entidades**        | Modelos de datos (Product, Movement, StockAlert)      |
| **Código existente** | Servicios y controladores existentes                |

### 3. Desarrollo

```
1. Leer y confirmar comprensión de la US
2. Revisar ANALISIS.md para entender entidades y reglas
3. Revisar STACK.md para conocer tecnologías
4. Revisar código existente en src/ para patrón de implementación
5. Revisar entidades para modelo de datos
6. Implementar según criterios de aceptación
7. Crear/actualizar DTOs si es necesario
8. Verificar tipos Java
9. Compilar y verificar errores:
   - mvn compile
10. Ejecutar tests:
    - mvn test
```

### 4. Entregable

El agente entregar&aacute;:

- Archivos creados/modificados
- Criterios de aceptación cumplidos
- Notas sobre decisiones de diseño

---

## Estado de la US

| Estado            | Descripción                  |
| ----------------- | ---------------------------- |
| **Pendiente**     | US asignada pero no iniciada |
| **En Análisis**   | Entendiendo requisitos       |
| **En Desarrollo** | Implementando              |
| **En Review**     | Esperando feedback          |
| **Completada**    | Aprobada                   |

---

## Recursos del Proyecto

### Archivos de Referencia

| Archivo         | Descripción                                     |
| --------------- | ----------------------------------------------- |
| ANALISIS.md     | Requisitos del sistema, entidades, casos de uso |
| STACK.md        | Stack técnico (Spring Boot + JPA + H2)        |
| USER-STORIES.md | User Stories definidas                          |

### Estructura del Proyecto

```
src/main/java/com/stockflow/
├── controller/              # Controladores REST
├── service/                # Lógica de negocio
├── repository/             # Repositorios JPA
├── model/                  # Entidades
├── dto/                    # DTOs
├── exception/              # Excepciones
└── config/                 # Configuración
```

### Stack Técnico

- **Backend**: Spring Boot 3.5+
- **ORM**: Spring Data JPA
- **Base de datos**: H2
- **Resilience**: Resilience4j
- **Testing**: JUnit 5 + Mockito

### Convenciones de Código

- **Controladores**: PascalCase (ej: `ProductController`)
- **Servicios**: PascalCase (ej: `ProductService`)
- **DTOs**: PascalCase con sufijo DTO (ej: `ProductRequestDto`)
- **Entidades**: PascalCase (ej: `Product`)

---

## Formato de US (Referencia)

```markdown
# US-XXX: [Título]

## Descripción

Como [tipo de usuario], quiero [funcionalidad] para [beneficio].

## Criterios de Aceptación

- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

## Ideas de Test

- [ ] Idea de test 1
- [ ] Idea de test 2

## Notas Técnicas

[Decisiones de implementación]

## Bloqueos

[Dependencias o issues bloqueantes]
```

---

## Dependencias entre Módulos

### Flujo Principal

```
Products → Movements → Alerts
    ↓          ↓
  Stock    History
  Update   Movements
```

---

## Notas de Implementación

### Revisar Antes de Implementar

1. **Entidades existentes**: Verificar en `com.stockflow.model`
2. **Servicios API**: Verificar en `com.stockflow.service`
3. **DTOs**: Revisar en carpeta `dto/`
4. **Compilar**: Usar `mvn compile` después de cambios

### Patrones de Implementación

- **CRUD**: Crear service + controller + repository + DTOs
- **Patrón Repository**: Usar JPA en servicios
- **Validaciones**: Usar Bean Validation en DTOs
- **Errores**: Usar @RestControllerAdvice
- **Resilience4j**: Aplicar Circuit Breaker, Retry, Rate Limiter

---

## Commands Útiles

```bash
# Desarrollo
mvn spring-boot:run

# Compilar
mvn clean compile

# Test
mvn test

# Test con coverage
mvn test jacoco:report

# Build
mvn clean package

# Dependencias
mvn dependency:tree

# Validar
mvn validate
```

---

## Próximos Pasos

1. Seleccionar US pendiente de USER-STORIES.md
2. Revisar dependencias y bloqueos
3. Implementar según criterios
4. Verificar contra STACK.md
5. Ejecutar tests
6. Actualizar estado en USER-STORIES.md

---

## Integración con Otros Módulos

### inventory-app (Frontend)

El backend inventory-service expone API REST para ser consumida por Angular:

- Endpoints en `/api/v1/*`
- JSON para intercambio de datos
- Manejo de errores consistente
- Documentación Swagger en `/swagger-ui.html`

---

## Health Checks

### Spring Actuator

- `/actuator/health` - Estado general
- `/actuator/metrics` - Métricas
- `/actuator/info` - Información del servicio

### Custom Health Indicator

Verifica si más del 20% de productos están en alerta crítica.

---

## Documentación

### OpenAPI / Swagger

- Anotaciones @Operation en cada endpoint
- Anotaciones @ApiResponse para códigos HTTP
- Anotaciones @Schema para modelos
- Swagger UI en `/swagger-ui.html`