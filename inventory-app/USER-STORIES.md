# USER-STORIES.md - Historias de Usuario

## Historial de US

| US     | Título                                         | Complejidad | Estado     | Dependencias           | Notes                                                                 |
| ------ | ---------------------------------------------- | ----------- | ---------- | ---------------------- | --------------------------------------------------------------------- |
| US-001 | Configurar Signals para estado global          | 2           | Completado | -                      | Base del estado global con signals                                    |
| US-002 | Interceptor HTTP para errores                  | 1           | Completado | -                      | Manejo centralizado de errores                                        |
| US-003 | Listado de productos con filtros y paginación  | 2           | Completado | US-001                 | Tabla con datos del API                                               |
| US-004 | Skeleton loaders durante peticiones            | 1           | Completado | US-003                 | UI de carga                                                           |
| US-005 | Panel de alertas con severidad visual          | 2           | Completado | US-001                 | Lista de alertas del API                                              |
| US-006 | Badge de estado de stock en tiempo real        | 1           | Completado | US-003                 | Columna en grid productos - Backend provee currentStock y minStock    |
| US-007 | Dashboard con KPIs derivados de signals        | 2           | Completado | US-001, US-003, US-005 | Requiere datos de productos y alertas                                 |
| US-008 | Persistencia de filtros en localStorage        | 1           | Completado | US-001                 | effect() para persistencia                                            |
| US-009 | Registro de movimiento con formulario reactivo | 2           | Completado | US-003                 | Modal desde grid productos + POST /api/v1/movements                   |
| US-010 | Deshabilitar botón durante petición            | 1           | Completado | US-009                 | Botón "Registrar" del modal (US-009)                                  |
| US-011 | Actualización de stock automática              | 2           | Completado | US-009                 | Después de registrar - actualiza signals                              |
| US-012 | Carga diferida de historial con @defer         | 2           | Completado | -                      | Página de detalle con @defer (on viewport/interaction)                |
| US-013 | Endpoint de estadísticas avanzadas             | 2           | Completado | US-012                 | Nuevo endpoint GET /products/{id}/stats - elimina cálculo en frontend |

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

- [x] Crear interceptor con HttpInterceptorFn
- [x] Parsear ErrorResponse del backend
- [x] Mostrar toast de error descriptivo
- [x] Manejar códigos 400, 404, 422, 500
- [x] Agregar data-test-id: `error-message`, `toast-error`

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

- [x] Mostrar tabla de productos
- [x] Agregar filtro por categoría
- [x] Agregar paginación
- [x] Integrar con endpoint /api/v1/products
- [x] Agregar data-test-id: `product-list-table`, `product-list-filter-category`, `product-list-paginator`

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 4 horas |

### Tests Propuestos

- [ ] Verificar que la tabla de productos se renderiza con datos
- [ ] Verificar que el filtro por categoría filtra correctamente los productos
- [ ] Verificar que la paginación navega entre páginas
- [ ] Verificar que se muestra el skeleton durante la carga

---

## US-004: Skeleton loaders durante peticiones

### Descripción

Como usuario, quiero ver skeleton loaders durante las peticiones HTTP.

### Criterios de Aceptación

- [x] Mostrar skeleton durante carga de productos
- [x] Mostrar skeleton durante carga de alertas
- [x] Animación de shimmer
- [x] Diseño consistente con UI
- [x] Agregar data-test-id: `skeleton-loader`, `loading-spinner`

### Estimación

| Complejidad | 1 |
| Tiempo estimado | 2 horas |

### Tests Propuestos

- [ ] Verificar que el skeleton se muestra durante la carga de productos
- [ ] Verificar que el skeleton se muestra durante la carga de alertas
- [ ] Verificar que la animación de shimmer funciona correctamente

---

## US-005: Panel de alertas con severidad visual

### Descripción

Como usuario, quiero ver el panel de alertas con indicador visual de severidad.

### Criterios de Aceptación

- [x] Listar productos con stock bajo el mínimo
- [x] Mostrar indicador visual diferenciado por color
- [x] Severity LOW en color naranja
- [x] Severity CRITICAL en color rojo
- [x] Integrar con endpoint /api/v1/alerts
- [x] Agregar data-test-id: `alerts-panel-list`, `alert-item-{productId}`, `alert-severity-{productId}`

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 4 horas |

### Tests Propuestos

- [ ] Verificar que se listan las alertas con stock bajo el mínimo
- [ ] Verificar que severity LOW se muestra en color naranja
- [ ] Verificar que severity CRITICAL se muestra en color rojo
- [ ] Verificar que las alertas se cargan desde el endpoint /api/v1/alerts

---

## US-006: Badge de estado de stock en tiempo real

### Descripción

Como usuario, quiero ver el estado del stock visualizado con badges de colores.

### Criterios de Aceptación

- [x] Badge OK: currentStock > minStock (verde)
- [x] Badge BAJO: currentStock <= minStock (naranja)
- [x] Badge CRÍTICO: currentStock <= minStock / 2 (rojo)
- [x] Cálculo en tiempo real
- [x] Agregar data-test-id: `product-stock-badge-{sku}`

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

## US-007: Dashboard con KPIs derivados de signals

### Descripción

Como usuario, quiero ver un dashboard KPI cards mostrando: total de productos, alertas activas, alertas criticas y valor
total de inventario derivados de computed signals derivados automáticamente para monitorear el inventario en tiempo real.

### Criterios de Aceptación

- [x] Mostrar total de productos (computed desde signals)
- [x] Mostrar alertas activas (computed desde signals)
- [x] Mostrar alertas críticas (computed desde signals)
- [x] Mostrar valor total del inventario (computed desde signals)
- [x] Agregar data-test-id a cada KPI: `dashboard-total-products`, `dashboard-total-alerts`, `dashboard-critical-alerts`, `dashboard-total-value`

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

## US-008: Persistencia de filtros en localStorage

### Descripción

Como usuario, quiero que los filtros se guarden en localStorage.

### Criterios de Aceptación

- [x] Usar effect() para persistir filtros
- [x] Recuperar filtros al cargar la página
- [x] Limpiar filtros cuando sea necesario
- [x] Agregar data-test-id: `filter-category`, `filter-paginator`

### Estimación

| Complejidad | 1 |
| Tiempo estimado | 2 horas |

### Tests Propuestos

- [ ] Verificar que los filtros se guardan en localStorage mediante effect()
- [ ] Verificar que los filtros se recuperan al cargar la página
- [ ] Verificar que los filtros se limpian correctamente

---

## US-009: Registro de movimiento con formulario reactivo

### Descripción

Como usuario, quiero registrar movimientos de inventario mediante un formulario reactivo.

### Criterios de Aceptación

- [x] Formulario con ReactiveFormsModule
- [x] Campo producto (select, obligatorio)
- [x] Campo tipo (IN/OUT, obligatorio)
- [x] Campo cantidad (number, > 0, obligatorio)
- [x] Campo razón (text, obligatorio)
- [x] Validaciones en tiempo real
- [x] Mostrar alerta de error si el servicio retorna error (ej: stock insuficiente)
- [x] Recargar categorías después de registrar movimiento IN (para actualizar select de categorías)
- [x] Agregar data-test-id: `movement-form`, `movement-form-product`, `movement-form-type`, `movement-form-quantity`, `movement-form-reason`, `movement-form-submit`

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

- [x] Deshabilitar botón "Registrar" mientras petición en vuelo
- [x] Mostrar indicador de carga
- [x] Habilitar después de respuesta
- [x] Agregar data-test-id: `movement-form-submit[disabled]`

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

- [x] Registrar movimiento vía API
- [x] Actualizar señal de productos automáticamente
- [x] Recargar alertas después del movimiento
- [x] Mostrar toast de éxito/error
- [x] Agregar data-test-id: `toast-notification`

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

Como usuario, quiero ver el detalle de un producto y su historial de movimientos en una página dedicada con carga diferida.

### Criterios de Aceptación

- [x] Agregar columna de acción en grid de productos
- [x] Mostrar icono de ojo en cada fila
- [x] Al hacer click, navegar a página de detalle (/products/:id)
- [x] Breadcrumb: Productos > Detalle
- [x] Card con detalle del producto (consume /api/v1/products/{id})
- [x] @defer (on viewport) para estadísticas avanzadas (al hacer scroll)
- [x] @defer (on interaction) para historial de movimientos (al hacer click)
- [x] @placeholder con skeleton animado
- [x] @loading con spinner centrado
- [x] @error con mensaje amigable
- [x] Integrar con endpoint /api/v1/movements/{productId}/history
- [x] Estadísticas avanzadas: total movimientos, entradas, salidas, último movimiento
- [x] Agregar data-test-id: `product-detail-card`, `movement-history-list`, `movement-history-loading`, `movement-history-error`, `product-stats`, `product-stats-loading`, `product-stats-error`

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 4 horas |

### Tests Propuestos

- [ ] Verificar que la columna de acción se muestra en el grid
- [ ] Verificar que el icono de ojo es clickeable
- [ ] Verificar que navega a página de detalle
- [ ] Verificar que el breadcrumb muestra "Productos > Detalle"
- [ ] Verificar que las estadísticas avanzadas se cargan con @defer (on viewport)
- [ ] Verificar que el historial se carga con @defer (on interaction)
- [ ] Verificar que el @placeholder muestra skeleton animado
- [ ] Verificar que el @loading muestra spinner centrado
- [ ] Verificar que el @error muestra mensaje amigable

### Notas

- **Grid**: Se modifica el grid de productos (US-003)
- **Ruta**: /products/:id (lazy-loaded)
- **Detalle**: GET /api/v1/products/{id}
- **Historial**: GET /api/v1/movements/{productId}/history
- **Estadísticas**: @defer (on viewport) - se carga al hacer scroll
- **Historial**: @defer (on interaction) - se carga al hacer click/interaction
- **Estadísticas avanzadas**: Métricas calculadas desde el historial (total movimientos, entradas, salidas, último movimiento)

---

## US-013: Endpoint de Estadísticas Avanzadas

### Descripción

Como usuario del sistema, quiero obtener estadísticas avanzadas de un producto directamente del backend para eliminar el cálculo en el frontend.

### Criterios de Aceptación

- [x] Consumir nuevo endpoint GET /api/v1/products/{id}/stats
- [x] Mostrar totalMovements, totalIn, totalOut, averagePerMonth, lastMovement
- [x] Eliminar cálculo manual de estadísticas en product-detail.page.ts
- [x] Agregar averagePerMonth a la interfaz de estadísticas

### Estimación

| Complejidad | 2 |
| Tiempo estimado | 2 horas |

### Tests Propuestos

- [ ] Verificar que las estadísticas se cargan desde el nuevo endpoint
- [ ] Verificar que averagePerMonth se muestra correctamente
- [ ] Verificar que se elimina el código de cálculo manual

### Notas

- **Endpoint**: GET /api/v1/products/{id}/stats
- **Anterior**: Se calculaba en frontend cargando 1000 movimientos
- **Nuevo**: El backend calcula directamente desde la base de datos
