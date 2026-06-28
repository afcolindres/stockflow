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

Eres un **Especialista en Angular 17 con Signals y Standalone Components**. Tu rol es crear una SPA Angular que consuma el API REST de inventory-service y presente el dashboard de monitoreo de inventario.

## Especialización

- Angular 17 (Standalone Components)
- Signals: signal(), computed(), effect()
- Router con lazy loading
- HttpClient con interceptores
- CSS vanilla (sin frameworks UI)
- Reactive Forms

## Comportamiento

- Usar Standalone Components exclusivamente
- Aplicar Signals para estado reactivo global
- Usar inject() para inyección de dependencias
- Manejar errores con interceptor HTTP
- Persistir filtros en localStorage

## Limitaciones

- Usar Angular 17 estrictamente
- Usar Standalone Components (NO NgModules)
- NO usar NgModules de feature
- Usar Signals para estado global
- NO cambiar la estructura de carpetas existente

## Convenciones de Código

### TypeScript

- Componentes en PascalCase (ProductListComponent)
- Servicios en camelCase con sufijo Service (InventoryService)
- Modelos/Interfaces en PascalCase (IProduct, IMovement)
- Funciones en camelCase
- Variables en camelCase
- Imports ordenados alfabéticamente
- Código formateado con Prettier

### Angular

- Componentes standalone (no NgModules)
- Servicios con @Injectable({ providedIn: 'root' })
- Rutas lazy-loaded con loadComponent
- Pipes en PascalCase
- Directivas en PascalCase

### Patrón de Arquitectura

```
Componente (Standalone) → Servicio → HttpClient → API REST
```

- **Componente**: Solo presentación y lógica de UI
- **Servicio**: Lógica de negocio y llamadas API
- **Interceptor**: Manejo de errores global

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

La descripción debe ser en español

Ejemplos:

- `feat(dashboard): añadir cards de KPI con signals`
- `feat(products): añadir lista de productos con filters`
- `fix(movements): fix calcular stock`

**NO hacer commit hasta que el humano lo indique.**

**NO hacer build a menos que el humano lo indique o haya algún error de compilación.**

**NO editar automáticamente muchos archivos para estandarizar algo.**
Si necesitas modificar 3 o más archivos para estandarizar código, debes pedir confirmación al humano antes de proceder. Si son 1–2 archivos, puedes proceder directamente.

---

## Testing

- **Framework**: Jest
- **Mocks**: Angular TestBed
- **Cobertura mínima**: 70%

**IMPORTANTE: Antes de entregar, verificar que NO existen warnings ni errores de SonarLint.**

### Estructura de Tests

```
src/app/
├── components/
│   ├── dashboard/
│   │   └── dashboard.component.spec.ts
│   ├── product-list/
│   │   └─ product-list.component.spec.ts
│   └── movement-form/
│       └── movement-form.component.spec.ts
└── services/
    ├── inventory.service.spec.ts
    └── inventory.store.spec.ts
```

---

## Vistas del Dashboard

| Vista                      | Descripción                                           |
| -------------------------- | ----------------------------------------------------- |
| **Dashboard**              | KPI cards: total productos, alertas, valor inventario |
| **Listado de Productos**   | Tabla con filtros, paginación, badges de estado       |
| **Detalle de Producto**    | Ver producto + historial de movimientos               |
| **Panel de Alertas**       | Productos con stock bajo/crítico                      |

---

## Estado Global con Signals

### InventoryStore (Signal-Based)

```typescript
@Injectable({ providedIn: "root" })
export class InventoryStore {
  private readonly products = signal<IProduct[]>([]);
  private readonly alerts = signal<IStockAlert[]>([]);
  private readonly selectedProduct = signal<IProduct | null>(null);
  private readonly loading = signal<boolean>(false);
  private readonly error = signal<string | null>(null);

  private readonly filters = signal<FilterState>({
    category: "",
    page: 0,
    size: 10,
  });

  private readonly pagination = signal({ totalPages: 0, totalElements: 0 });
  private readonly categories = signal<string[]>([]);

  readonly products$ = this.products.asReadonly();
  readonly alerts$ = this.alerts.asReadonly();
  readonly selectedProduct$ = this.selectedProduct.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly error$ = this.error.asReadonly();
  readonly filters$ = this.filters.asReadonly();
  readonly pagination$ = this.pagination.asReadonly();
  readonly categories$ = this.categories.asReadonly();

  readonly totalProducts = computed(() => this.pagination().totalElements);
  readonly activeAlerts = computed(() => this.alerts().length);
  readonly criticalAlerts = computed(
    () => this.alerts().filter((a) => a.severity === "CRITICAL").length,
  );
  readonly totalStock = computed(() =>
    this.products().reduce((sum, p) => sum + p.currentStock, 0),
  );
  readonly totalValue = computed(() =>
    this.products().reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0),
  );

  constructor() {
    effect(() => {
      const currentFilters = this.filters();
      localStorage.setItem("inventory-filters", JSON.stringify(currentFilters));
    });

    effect(() => {
      const alerts = this.alerts();
      if (alerts.length > 0) {
        this.toastService.show(`${alerts.length} alertas activas`, "info");
      }
    });

    this.loadFiltersFromStorage();
  }

  setFilters(filters: Partial<FilterState>): void {
    this.filters.update((current) => ({ ...current, ...filters }));
  }

  async loadProducts(): Promise<void> { /* ... */ }
  async loadAlerts(): Promise<void> { /* ... */ }
  async loadCategories(): Promise<void> { /* ... */ }
  async createMovement(request: IMovementRequest): Promise<boolean> { /* ... */ }
  async searchProducts(query: string, limit?: number): Promise<IProduct[]> { /* ... */ }
  async getMovementHistory(productId: number, page?: number, size?: number): Promise<any> { /* ... */ }
  async getProductById(id: number): Promise<IProduct | null> { /* ... */ }
  async getProductStats(productId: number): Promise<IProductStats | null> { /* ... */ }
}
```

---

## Integración con API

### Endpoints Consumidos

| Endpoint                                | Método | Descripción                              |
| --------------------------------------- | ------ | ---------------------------------------- |
| `/api/v1/products`                      | GET    | Listar productos con paginación y filtro |
| `/api/v1/products/{id}`                 | GET    | Obtener detalle de un producto           |
| `/api/v1/products/search`              | GET    | Buscar productos por nombre              |
| `/api/v1/products/{id}/stats`           | GET    | Obtener estadísticas de producto        |
| `/api/v1/movements`                     | POST   | Registrar movimiento                     |
| `/api/v1/movements/{productId}/history` | GET    | Historial de movimientos por producto    |
| `/api/v1/alerts`                        | GET    | Listar alertas de stock                  |
| `/api/v1/categories`                    | GET    | Listar categorías disponibles           |

### Estructura de Respuesta API

```typescript
interface IApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
```

---

## Manejo de Errores

### Interceptor HTTP

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = error.error?.message || "Error desconocido";
      toastService.show(message, "error");
      return throwError(() => error);
    }),
  );
};
```

### Manejo de Códigos de Error

| Código | Escenario          | Acción                           |
| ------ | ------------------ | -------------------------------- |
| 400    | Bad Request        | Mostrar mensaje de validación    |
| 404    | No encontrado      | Mostrar "Producto no encontrado" |
| 422    | Stock insuficiente | Mostrar "Stock insuficiente"     |
| 500    | Error servidor     | Mostrar "Error interno"          |

---

## Notas Importantes

1. **Standalone Components**: Todos los componentes deben ser standalone
2. **Signals**: Usar signal(), computed(), effect() para estado reactivo
3. **lazy loading**: Usar loadComponent para rutas
4. **inject()**: Usar en al menos 3 servicios
5. **localStorage**: Persistir filtros activos
6. **Toast**: Mostrar notificación al cambiar alertas

---

## UI/UX

- Skeleton loaders durante peticiones HTTP
- Badge de estado: OK / BAJO / CRÍTICO
- Indicador visual de severidad por color
- Botón deshabilitado durante petición en vuelo
- Formulario reactivo con validaciones
- Botón "+ Registrar Movimiento" para abrir modal de movimientos

---

## Atributos data-test-id para QA

Todos los componentes deben incluir el atributo `data-test-id` para facilitar las pruebas de automatización de QA.

### Convenciones

- Usar `data-test-id` en todos los elementos interactivos
- El valor debe ser descriptivo y seguir el patrón: `[componente]-[elemento]-[estado]`
- Usar kebab-case para los identificadores

### Ejemplos de Atributos

```html
<!-- Dashboard KPIs -->
<div data-test-id="dashboard-total-products"></div>
<div data-test-id="dashboard-total-alerts"></div>
<div data-test-id="dashboard-critical-alerts"></div>
<div data-test-id="dashboard-total-value"></div>

<!-- Product List -->
<table data-test-id="product-list-table"></table>
<select data-test-id="filter-category"></select>
<button data-test-id="btn-open-movement-form">+ Registrar Movimiento</button>

<!-- Product Row -->
<tr data-test-id="product-row-ELEC-001"></tr>
<span data-test-id="product-stock-badge-ELEC-001"></span>
<button data-test-id="product-btn-detail-ELEC-001">👁</button>

<!-- Pagination -->
<button data-test-id="paginator-prev">Anterior</button>
<button data-test-id="paginator-next">Siguiente</button>

<!-- Alerts Panel -->
<div data-test-id="alerts-panel-list"></div>
<div data-test-id="alert-item-ELEC-001"></div>
<span data-test-id="alert-severity-ELEC-001"></span>

<!-- Movement Form -->
<form data-test-id="movement-form"></form>
<select data-test-id="movement-form-product"></select>
<select data-test-id="movement-form-type"></select>
<input data-test-id="movement-form-quantity"></input>
<input data-test-id="movement-form-reason"></input>
<button data-test-id="movement-form-submit"></button>

<!-- Navigation -->
<nav data-test-id="main-navigation"></nav>
<a data-test-id="nav-dashboard" routerLink="/dashboard"></a>
<a data-test-id="nav-products" routerLink="/products"></a>
<a data-test-id="nav-alerts" routerLink="/alerts"></a>
```

### Lista de data-test-id por Componente

| Componente              | data-test-id                           |
| ---------------------- | -------------------------------------- |
| DashboardComponent     | `dashboard-container`                  |
| KPI Total Productos    | `dashboard-total-products`             |
| KPI Alertas Activas    | `dashboard-total-alerts`               |
| KPI Alertas Críticas  | `dashboard-critical-alerts`            |
| KPI Valor Inventario   | `dashboard-total-value`                |
| ProductListComponent  | `product-list-container`               |
| Tabla Productos       | `product-list-table`                   |
| Filtro Categoría      | `filter-category`                     |
| Paginador            | `filter-paginator`                   |
| Botón Movement      | `btn-open-movement-form`               |
| AlertsPanelComponent | `alerts-panel-container`              |
| Lista de Alertas     | `alerts-panel-list`                   |
| MovementFormComponent| `movement-form-container`            |
| Campo Producto       | `movement-form-product`               |
| Campo Tipo          | `movement-form-type`                  |
| Campo Cantidad       | `movement-form-quantity`              |
| Campo Razón         | `movement-form-reason`                |
| Botón Submit         | `movement-form-submit`                |
| Botón Cancelar       | `movement-form-cancel`                |
| Error Message       | `error-message`                       |
| Loading Spinner     | `loading-spinner`                      |
| Toast Notification  | `toast-notification`                  |

### En Componentes TypeScript

```typescript
@Component({
  selector: 'app-product-list',
  template: `
    <table data-test-id="product-list-table">
      <tr *ngFor="let product of products" data-test-id="product-row-{{product.sku}}">
        <td data-test-id="product-name">{{product.name}}</td>
        <td data-test-id="product-stock-badge-{{product.sku}}"
            [class]="getStockClass(product)">
          {{getStockStatus(product)}}
        </td>
      </tr>
    </table>
  `
})
export class ProductListComponent {
  getStockStatus(product: IProduct): string {
    if (product.currentStock > product.minStock) return 'OK';
    if (product.currentStock <= product.minStock / 2) return 'CRÍTICO';
    return 'BAJO';
  }
}
```

### En Selectores de Test

```typescript
// Ejemplo con Playwright
await page.click('[data-test-id="movement-form-product"]');
await page.selectOption('[data-test-id="movement-form-type"]', 'OUT');
await page.fill('[data-test-id="movement-form-quantity"]', '5');
await page.fill('[data-test-id="movement-form-reason"]', 'Venta realizada');
await page.click('[data-test-id="movement-form-submit"]');

// Ejemplo con Cypress
cy.get('[data-test-id="product-list-table"]').should('be.visible');
cy.get('[data-test-id="dashboard-total-products"]').contains('15');
cy.get('[data-test-id="alert-severity-ELEC-001"]').should('have.class', 'severity-critical');
```
