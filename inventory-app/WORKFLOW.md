# WORKFLOW.md - Flujo de Trabajo con Historias de Usuario

Este documento define cómo trabajar con las Historias de Usuario (US) en el proyecto inventory-app.

---

## Proceso de Desarrollo por US

### 1. Recepción de US

Cuando se asigne una US, esta debe incluir:

- **Título** de la historia
- **Descripción** (Como usuario quiero...)
- **Criterios de aceptación** (Given/When/Then)

### 2. Revisión Previa

Antes de implementar, el agente revisará:

| Archivo               | Propósito                                        |
| --------------------- | ------------------------------------------------ |
| **ANALISIS.md**       | Requisitos, entidades y casos de uso del negocio |
| **STACK.md**          | Stack técnico, tecnologías y herramientas        |
| **USER-STORIES.md**   | Las User Stories de Angular                      |
| **inventory-service** | Endpoints del API disponibles                    |

### 3. Desarrollo

```
1. Leer y confirmar comprensión de la US
2. Revisar ANALISIS.md para entender entidades y reglas
3. Revisar STACK.md para conocer tecnologías
4. Revisar código existente en inventory-service
5. Implementar según criterios de aceptación
6. Verificar según STACK.md
7. Verificar tipos TypeScript
8. Tests unitarios con Jest
9. Formatear archivos con Prettier:
   - TypeScript: npx prettier --write "src/**/*.{ts,tsx}"
```

### 4. Entregable

El agente entregara:

- Archivos creados/modificados
- Criterios de aceptación cumplidos
- Notas sobre decisiones de diseño

---

## Estado de la US

| Estado            | Descripción                  |
| ----------------- | ---------------------------- |
| **Pendiente**     | US asignada pero no iniciada |
| **En Análisis**   | Entendiendo requisitos       |
| **En Desarrollo** | Implementando                |
| **En Review**     | Esperando feedback           |
| **Completada**    | Aprobada                     |

---

## Recursos del Proyecto

### Archivos de Referencia

| Archivo         | Descripción                                     |
| --------------- | ----------------------------------------------- |
| ANALISIS.md     | Requisitos del sistema, entidades, casos de uso |
| STACK.md        | Stack técnico (Angular 17, Signals, CSS vanilla)   |
| USER-STORIES.md | User Stories de Angular                      |

### Estructura del Proyecto

```
src/app/
├── components/
│   ├── dashboard/        # KPI cards
│   ├── product-list/     # Tabla con filtros
│   ├── product-detail/  # Detalle + historial
│   ├── alerts-panel/     # Panel de alertas
│   ├── movement-form/    # Formulario reactivo (modal)
│   ├── navbar/          # Barra de navegación
│   └── skeleton-loader/  # Loader esqueleto
├── services/
│   ├── inventory.service.ts   # HTTP calls
│   ├── inventory.store.ts     # Signals state
│   └── toast.service.ts        # Notifications
├── interceptors/
│   └── error.interceptor.ts    # HTTP errors
├── models/
│   ├── product.model.ts
│   ├── movement.model.ts
│   └── alert.model.ts
└── mocks/
    ├── products.mock.ts
    ├── movements.mock.ts
    ├── alerts.mock.ts
    └── index.ts
```

### Stack Técnico

- **Framework**: Angular 17
- **Componentes**: Standalone
- **Estado**: Signals (signal, computed, effect)
- **UI**: CSS vanilla
- **HTTP**: HttpClient con interceptores
- **Testing**: Jest

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

## Estimación

| Complejidad | 1 |
| Tiempo estimado | 2 horas |

## Tests Propuestos

- [ ] Test 1
- [ ] Test 2

## Notas

- Nota sobre implementación o dependencias
```

## Dependencias entre US

### Estado Global

US-001 (Signals)
├─ US-002 (Interceptor HTTP)
├─ US-003 (Listado productos)
├─ US-005 (Panel alertas)
├─ US-007 (Dashboard KPIs)
└─ US-008 (localStorage)

### Productos y Grid

US-003 (Listado productos)
└─ US-006 (Badge stock)

### Formulario de Movimiento

US-003 (Listado productos)
└─ US-009 (Formulario movimiento)
├─ US-010 (Deshabilitar botón)
└─ US-011 (Stock automático)

### Detalle de Producto

US-003 (Listado productos)
└─ US-012 (Detalle producto)
└─ US-013 (Estadísticas producto)

### UI

US-003 (Listado productos)
└─ US-004 (Skeleton loaders)

---

## Notas de Implementación

### Revisar Antes de Implementar

1. **Entidades existentes**: Verificar en models/
2. **Servicios API**: Verificar en inventory-service
3. **Componentes**: Revisar en components/ para reutilizar
4. **Signals**: Usar signal(), computed(), effect()
5. **CSS vanilla**: Sin frameworks UI

### Patrones de Implementación

- **Standalone**: Todos los componentes son standalone
- **Signals**: signal() para estado, computed() para derivados, effect() para side effects
- **lazy loading**: loadComponent para rutas
- **localStorage**: effect() para persistencia (key: inventory-filters)
- **Modal**: MovementForm como modal desde ProductList

---

## Commands Útiles

```bash
# Desarrollo
ng serve

# Build
ng build

# Test (Jest)
npm test

# Test coverage
npm run test:coverage

# Test watch
npm run test:watch
```

---

## Próximos Pasos

1. Seleccionar US pendientes de USER-STORIES.md
2. Revisar dependencias y bloqueos
3. Implementar según criterios
4. Tests unitarios (70% cobertura)
5. Actualizar estado en USER-STORIES.md
