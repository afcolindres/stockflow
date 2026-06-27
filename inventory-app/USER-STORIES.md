# USER-STORIES.md - Historias de Usuario

## Historial de US

| US     | Título                                         | Complejidad | Estado    | Dependencias                          | Notes                                      |
| ------ | ---------------------------------------------- | ----------- | --------- | ----------------------------------- | ----------------------------------------- |
| US-001 | Configurar Signals para estado global          | 2           | Completado | -                                   | Base del estado global con signals             |
| US-002 | Interceptor HTTP para errores                  | 1           | Completado | -                                   | Manejo centralizado de errores                |
| US-003 | Listado de productos con filtros y paginación  | 2           | Pendiente | US-001                               | Tabla con datos del API                    |
| US-004 | Skeleton loaders durante peticiones            | 1           | Pendiente | US-003                               | UI de carga                             |
| US-005 | Panel de alertas con severidad visual          | 2           | Pendiente | US-001                               | Lista de alertas del API                  |
| US-006 | Badge de estado de stock en tiempo real        | 1           | Pendiente | US-003                               | Columna en grid productos - Backend provee currentStock y minStock |
| US-007 | Dashboard con KPIs derivados de signals        | 2           | Pendiente | US-001, US-003, US-005               | Requiere datos de productos y alertas      |
| US-008 | Persistencia de filtros en localStorage        | 1           | Pendiente | US-001                               | effect() para persistencia               |
| US-009 | Registro de movimiento con formulario reactivo | 2           | Pendiente | US-003                               | Modal desde grid productos + POST /api/v1/movements |
| US-010 | Deshabilitar botón durante petición            | 1           | Pendiente | US-009                               | Botón "Registrar" del modal (US-009)           |
| US-011 | Actualización de stock automática              | 2           | Pendiente | US-009                               | Después de registrar - actualiza signals       |
| US-012 | Carga diferida de historial con @defer         | 2           | Pendiente | -                                   | @defer (on interaction)               |

---

## US-001: Configurar Signals para estado global

### Descripción

Como desarrollador, quiero configurar Signals para el estado global del inventario para gestionar la reactividad de la aplicación.

### Criterios de Aceptación

- [x] Crear InventoryStore con @Injectable({ providedIn: 'root' })
- [x] Implementar signal() para: products, alerts, selectedProduct, loading, error
- [x] Implementar computed() para: totalProducts, criticalAlerts, totalValue
- [x] Implementar effect() para persistir filtros y mostrar toast de alertas

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 4 horas |

### Tests Propuestos

- [x] Verificar que InventoryStore se crea correctamente como servicio singleton
- [x] Verificar que signal() inicializa con valores por defecto
- [x] Verificar que computed() calcula totalProducts correctamente
- [x] Verificar que computed() calcula criticalAlerts correctamente
- [x] Verificar que computed() calcula totalValue correctamente
- [x] Verificar que effect() persiste filtros en localStorage

---

## US-002: Interceptor HTTP para errores

### Descripción

Como desarrollador, quiero un interceptor para manejar errores HTTP globalmente.

### Criterios de Aceptación

- [ ] Crear interceptor con HttpInterceptorFn
- [ ] Parsear ErrorResponse del backend
- [ ] Mostrar toast de error descriptivo
- [ ] Manejar códigos 400, 404, 422, 500
- [ ] Agregar data-test-id: `error-message`, `toast-error`

### Estimación

| Complejidad | 1 |
| Tiempo estimado | 2 horas |

### Tests Propuestos

- [ ] Verificar que el interceptor captura errores 400 y muestra mensaje de validación
- [ ] Verificar que el interceptor captura errores 404 y muestra mensaje de "no encontrado"
- [ ] Verificar que el interceptor captura errores 422 y muestra mensaje de "stock insuficiente"
- [ ] Verificar que el interceptor captura errores 500 y muestra mensaje de "error interno"

---

## US-003: Listado de productos con filtros y paginación

### Descripción

Como usuario, quiero ver un listado de productos con filtros por categoría y paginación.

### Criterios de Aceptación

- [ ] Mostrar tabla de productos
- [ ] Agregar filtro por categoría
- [ ] Agregar paginación
- [ ] Integrar con endpoint /api/v1/products
- [ ] Agregar data-test-id: `product-list-table`, `product-list-filter-category`, `product-list-paginator`

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 4 horas |

### Tests Propuestos

- [ ] Verificar que la tabla de productos se renderiza con datos
- [ ] Verificar que el filtro por categoría filtra correctamente los productos
- [ ] Verificar que la paginación navega entre páginas
- [ ] Verificar que se muestra el skeleton durante la carga

---

## US-004: Panel de alertas con severidad visual

### Descripción

Como usuario, quiero ver el panel de alertas con indicador visual de severidad.

### Criterios de Aceptación

- [ ] Listar productos con stock bajo el mínimo
- [ ] Mostrar indicador visual diferenciado por color
- [ ] Severity LOW en color naranja
- [ ] Severity CRITICAL en color rojo
- [ ] Integrar con endpoint /api/v1/alerts
- [ ] Agregar data-test-id: `alerts-panel-list`, `alert-item-{productId}`, `alert-severity-{productId}`

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 4 horas |

### Tests Propuestos

- [ ] Verificar que se listan las alertas con stock bajo el mínimo
- [ ] Verificar que severity LOW se muestra en color naranja
- [ ] Verificar que severity CRITICAL se muestra en color rojo
- [ ] Verificar que las alertas se cargan desde el endpoint /api/v1/alerts

---

## US-005: Badge de estado de stock en tiempo real

### Descripción

Como usuario, quiero ver el estado del stock visualizado con badges de colores.

### Criterios de Aceptación

- [ ] Badge OK: currentStock > minStock (verde)
- [ ] Badge BAJO: currentStock <= minStock (naranja)
- [ ] Badge CRÍTICO: currentStock <= minStock / 2 (rojo)
- [ ] Cálculo en tiempo real
- [ ] Agregar data-test-id: `product-stock-badge-{sku}`

### Estimación

| Complejidad | 1 |
| Tiempo estimado | 2 horas |

### Tests Propuestos

- [ ] Verificar que badge muestra "OK" cuando currentStock > minStock
- [ ] Verificar que badge muestra "BAJO" cuando currentStock <= minStock
- [ ] Verificar que badge muestra "CRÍTICO" cuando currentStock <= minStock / 2
- [ ] Verificar que el cálculo del badge se actualiza en tiempo real

### Notas

- **Implementación**: El badge se implementa como columna adicional en el grid de productos (US-003)
- **Backend**: El endpoint /api/v1/products retorna `currentStock` y `minStock` - no requiere nuevo endpoint

---

## US-006: Dashboard con KPIs derivados de signals

### Descripción

Como usuario, quiero ver un dashboard con KPIs derivados automáticamente para monitorear el inventario en tiempo real.

### Criterios de Aceptación

- [ ] Mostrar total de productos (computed desde signals)
- [ ] Mostrar alertas activas (computed desde signals)
- [ ] Mostrar alertas críticas (computed desde signals)
- [ ] Mostrar valor total del inventario (computed desde signals)
- [ ] Agregar data-test-id a cada KPI: `dashboard-total-products`, `dashboard-total-alerts`, `dashboard-critical-alerts`, `dashboard-total-value`

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 4 horas |

### Tests Propuestos

- [ ] Verificar que total de productos se muestra correctamente desde computed signal
- [ ] Verificar que alertas activas se muestra correctamente desde computed signal
- [ ] Verificar que alertas críticas se muestra correctamente desde computed signal
- [ ] Verificar que valor total del inventario se calcula correctamente
- [ ] Verificar que los KPIs se actualizan automáticamente cuando cambian los signals

### Notas

- **Datos proviene de**: InventoryStore (US-001)
- **Productos**: Se cargan desde /api/v1/products (US-003)
- **Alertas**: Se cargan desde /api/v1/alerts (US-005)
- **Cálculo**: Los KPIs se calculan automáticamente con computed() - no requiere endpoint adicional

---

## US-007: Persistencia de filtros en localStorage

### Descripción

Como usuario, quiero que los filtros se guarden en localStorage.

### Criterios de Aceptación

- [ ] Usar effect() para persistir filtros
- [ ] Recuperar filtros al cargar la página
- [ ] Limpiar filtros cuando sea necesario
- [ ] Agregar data-test-id: `filter-category`, `filter-paginator`

### Estimación

| Complejidad | 1 |
| Tiempo estimado | 2 horas |

### Tests Propuestos

- [ ] Verificar que los filtros se guardan en localStorage mediante effect()
- [ ] Verificar que los filtros se recuperan al cargar la página
- [ ] Verificar que los filtros se limpian correctamente

---

## US-008: Skeleton loaders durante peticiones

### Descripción

Como usuario, quiero ver skeleton loaders durante las peticiones HTTP.

### Criterios de Aceptación

- [ ] Mostrar skeleton durante carga de productos
- [ ] Mostrar skeleton durante carga de alertas
- [ ] Animación de shimmer
- [ ] Diseño consistente con UI
- [ ] Agregar data-test-id: `skeleton-loader`, `loading-spinner`

### Estimación

| Complejidad | 1 |
| Tiempo estimado | 2 horas |

### Tests Propuestos

- [ ] Verificar que el skeleton se muestra durante la carga de productos
- [ ] Verificar que el skeleton se muestra durante la carga de alertas
- [ ] Verificar que la animación de shimmer funciona correctamente

---

## US-009: Registro de movimiento con formulario reactivo

### Descripción

Como usuario, quiero registrar movimientos de inventario mediante un formulario reactivo.

### Criterios de Aceptación

- [ ] Formulario con ReactiveFormsModule
- [ ] Campo producto (select, obligatorio)
- [ ] Campo tipo (IN/OUT, obligatorio)
- [ ] Campo cantidad (number, > 0, obligatorio)
- [ ] Campo razón (text, obligatorio)
- [ ] Validaciones en tiempo real
- [ ] Mostrar alerta de error si el servicio retorna error (ej: stock insuficiente)
- [ ] Agregar data-test-id: `movement-form`, `movement-form-product`, `movement-form-type`, `movement-form-quantity`, `movement-form-reason`, `movement-form-submit`

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 4 horas |

### Tests Propuestos

- [ ] Verificar que el formulario se crea con ReactiveFormsModule
- [ ] Verificar que el campo producto es obligatorio
- [ ] Verificar que el campo tipo es obligatorio
- [ ] Verificar que la cantidad debe ser mayor a 0
- [ ] Verificar que el campo razón es obligatorio
- [ ] Verificar que las validaciones se muestran en tiempo real
- [ ] Verificar que se muestra alerta de error si el servicio retorna error 422

### Notas

- **Ubicación**: Modal/Drawer abierto desde botón en grid de productos (esquina superior izquierda)
- **Lista de productos**: Se obtiene desde /api/v1/products (mismo servicio US-003)
- **API de registro**: POST /api/v1/movements
- **Manejo de errores**: El backend retorna error 422 si stock insuficiente - mostrar mensaje del servicio

---

## US-010: Deshabilitar botón durante petición

### Descripción

Como usuario, quiero que el botón de registro se deshabilite durante la petición HTTP.

### Criterios de Aceptación

- [ ] Deshabilitar botón "Registrar" mientras petición en vuelo
- [ ] Mostrar indicador de carga
- [ ] Habilitar después de respuesta
- [ ] Agregar data-test-id: `movement-form-submit[disabled]`

### Estimación

| Complejidad | 1 |
| Tiempo estimado | 2 horas |

### Tests Propuestos

- [ ] Verificar que el botón se deshabilita durante la petición HTTP
- [ ] Verificar que se muestra indicador de carga mientras la petición está en vuelo
- [ ] Verificar que el botón se habilita después de recibir respuesta

### Notas

- **Botón**: El botón "Registrar" del modal de registro de movimiento (US-009)
- **Ubicación**: Dentro del modal abierto desde grid de productos
- **Comportamiento**: Se deshabilita mientras la petición POST /api/v1/movements está en vuelo

---

## US-011: Actualización de stock automática

### Descripción

Como sistema, quiero actualizar el stock del producto al registrar un movimiento.

### Criterios de Aceptación

- [ ] Registrar movimiento vía API
- [ ] Actualizar señal de productos automáticamente
- [ ] Recargar alertas después del movimiento
- [ ] Mostrar toast de éxito/error
- [ ] Agregar data-test-id: `toast-notification`

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 4 horas |

### Tests Propuestos

- [ ] Verificar que el movimiento se registra correctamente vía API
- [ ] Verificar que el stock del producto se actualiza automáticamente después del registro
- [ ] Verificar que las alertas se recargan después del registro
- [ ] Verificar que se muestra toast de éxito después de registrar

### Notas

- **Flujo**: Después de registrar movimiento en US-009
- **API**: POST /api/v1/movements
- **Actualización**: InventoryStore actualiza signals de productos y alertas automáticamente
- **Toast**: Mostrar mensaje del servicio (éxito o error)

---

## US-012: Carga diferida de historial con @defer

### Descripción

Como usuario, quiero que el historial de movimientos se cargue de forma diferida.

### Criterios de Aceptación

- [ ] Usar @defer (on interaction) para historial
- [ ] @placeholder con skeleton animado
- [ ] @loading con spinner centrado
- [ ] @error con mensaje amigable
- [ ] Integrar con endpoint /api/v1/movements/{productId}/history
- [ ] Agregar data-test-id: `movement-history-list`, `movement-history-loading`, `movement-history-error`

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 4 horas |

### Tests Propuestos

- [ ] Verificar que el historial se carga con @defer al hacer interaction
- [ ] Verificar que el @placeholder muestra skeleton animado
- [ ] Verificar que el @loading muestra spinner centrado
- [ ] Verificar que el @error muestra mensaje amigable
- [ ] Verificar que el historial se carga desde el endpoint /api/v1/movements/{productId}/history

### Notas

- **Ubicación**: Se carga al hacer click/interaction en una fila del grid de productos (US-003)
- **API**: GET /api/v1/movements/{productId}/history
- **Carga diferida**: @defer (on interaction) - solo carga cuando el usuario interactúa
