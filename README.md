# stockflow

Prueba técnica banco Cuscatlan - Sistema de Monitoreo de Inventario

---

## Descripción

API REST para gestión de inventario de productos con frontend Angular. Permite consultar stock, gestionar alertas de stock mínimo y registrar movimientos de entrada/salida.

---

## Estructura del Proyecto

| Módulo | Descripción |
|--------|-----------|
| `inventory-service` | Backend Spring Boot - API REST |
| `inventory-app` | Frontend Angular 17+ - SPA |

---

## Tiempo Invertido

| Módulo            | Tiempo Estimado |
| ----------------- | --------------- |
| inventory-service | 9 horas         |
| inventory-app     | 10 horas        |
| test           | 4 horas        |
| **Total**       | 23 horas       |

---

## Decisiones Técnicas

### Backend
- **Categorías**: Nuevo endpoint `/api/v1/categories` para obtener todas las categorías disponibles y evitar filtro limitado solo a productos de la página actual.
- **Estadísticas avanzadas**: Nuevo endpoint `/api/v1/products/{id}/stats` para obtener métricas del producto directamente desde el backend.
- **Búsqueda**: Endpoint `/api/v1/products/search` para buscar productos sin sobrecargar el select del formulario.
- **HikariCP**: Configuración explícita en application.yml:
  - `maximum-pool-size: 10` - Adecuado para carga media (~50-100 req/min)
  - `minimum-idle: 5` - Mantener conexiones activas para evitar overhead
  - `connection-timeout: 30000` - 30 segundos para obtener conexión
  - `idle-timeout: 600000` - 10 minutos para cerrar conexiones inactivas

### Frontend
- **@defer**: Carga diferida del historial de movimientos en nueva página de detalle del producto para mejorar rendimiento.

### Documentación
- **Archivos MD por módulo**: Cada módulo (`inventory-service`, `inventory-app`) tiene archivos de documentación independientes:
  - `README.md` - Documentación específica del módulo
  - `STACK.md` - Tecnologías y dependencias utilizadas
  - `WORKFLOW.md` - Flujo de desarrollo y comandos
  - `USER-STORIES.md` - Requisitos funcionales
  - `VERIFICATION.md` - Casos de prueba
  - `ANALISIS.md` - Análisis técnico
  - `AGENTS.md` - Configuración de agentes IA
- **Justificación**: Separar documentación por responsabilidad permite:
  - Mantenimiento más sencillo (cambios localizados)
  - Referencia rápida sin archivos monolíticos
  - Facilita colaboración con herramientas IA

---

## Herramientas de Testing

### Frontend
- **Framework**: Jest + Angular TestBed
- **Justificación**: Angular recomienda Jest por velocidad y mejor soporte para testing de componentes con Signals.

### Backend
- **Framework**: JUnit 5 + Mockito
- **Justificación**: Estándar de Spring Boot, integración nativa con Maven.

### Cobertura
- **Threshold mínimo**: 70% para ambos proyectos

---

## Licencia

Este proyecto es parte de una evaluación técnica confidencial.

---

## Autor

**Arnold Francisco Colindres Bertrand**

- **Email:** arnold_fcolindres@yahoo.com
- **GitHub:** github.com/afcolindres