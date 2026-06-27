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

Eres un **Especialista en Angular 16+ con Signals y Standalone Components**. Tu rol es crear una SPA Angular que consuma el API REST de inventory-service y presente el dashboard de monitoreo de inventario.

## Especialización

- Angular 16+ (Standalone Components)
- Signals: signal(), computed(), effect()
- @defer para vistas diferidas
- Router con lazy loading
- HttpClient con interceptores
- Angular Material (componentes UI)
- Reactive Forms

## Comportamiento

- Usar Standalone Components exclusivamente
- Aplicar Signals para estado reactivo global
- Implementar @defer para carga diferida
- Usar inject() para inyección de dependencias
- Manejar errores con interceptor HTTP
- Persistir filtros en localStorage

## Limitaciones

- Usar Angular 16+ estrictamente
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

- **Framework**: Jest o Jasmine/Karma
- **Mocks**: Angular TestBed
- **Cobertura mínima**: 70%

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
| **Panel de Alertas**       | Productos con stock bajo/crítico                      |
| **Registro de Movimiento** | Formulario reactivo para entradas/salidas             |

---

## Estado Global con Signals

### InventoryStore (Signal-Based)

```typescript
@Injectable({ providedIn: "root" })
export class InventoryStore {
  private products = signal<IProduct[]>([]);
  private alerts = signal<IStockAlert[]>([]);
  private selectedProduct = signal<IProduct | null>(null);
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);

  readonly products$ = this.products.asReadonly();
  readonly alerts$ = this.alerts.asReadonly();
  readonly selectedProduct$ = this.selectedProduct.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly error$ = this.error.asReadonly();

  readonly totalProducts = computed(() => this.products().length);
  readonly criticalAlerts = computed(
    () => this.alerts().filter((a) => a.severity === "CRITICAL").length,
  );
  readonly totalValue = computed(() =>
    this.products().reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0),
  );

  constructor() {
    effect(() => {
      localStorage.setItem("filters", JSON.stringify(this.filters()));
    });

    effect(() => {
      const alerts = this.alerts();
      if (alerts.length > 0) {
        this.toastService.show(`${alerts.length} alertas activas`);
      }
    });
  }
}
```

---

## @defer para Vistas Diferidas

### Historial de Movimientos (on interaction)

```html
@defer (on interaction(productCard)) {
<app-movement-history [productId]="product.id" />
} @placeholder {
<app-skeleton-loader />
} @loading {
<app-spinner />
} @error {
<app-error-message />
}
```

### Estadísticas Avanzadas (on viewport)

```html
@defer (on viewport) {
<app-advanced-stats [data]="products()" />
} @placeholder {
<app-skeleton-loader />
} @loading {
<app-spinner />
} @error {
<app-error-message />
}
```

---

## Integración con API

### Endpoints Consumidos

| Endpoint                                | Método | Descripción                              |
| --------------------------------------- | ------ | ---------------------------------------- |
| `/api/v1/products`                      | GET    | Listar productos con paginación y filtro |
| `/api/v1/products/{id}`                 | GET    | Obtener detalle de un producto           |
| `/api/v1/movements`                     | POST   | Registrar movimiento                     |
| `/api/v1/alerts`                        | GET    | Listar alertas de stock                  |
| `/api/v1/movements/{productId}/history` | GET    | Historial de movimientos por producto    |

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
3. **@defer**: Aplicar para historial y estadísticas avanzadas
4. **lazy loading**: Usar loadComponent para rutas
5. **inject()**: Usar en al menos 3 servicios
6. **localStorage**: Persistir filtros activos
7. **Toast**: Mostrar notificación al cambiar alertas

---

## UI/UX

- Skeleton loaders durante peticiones HTTP
- Badge de estado: OK / BAJO / CRÍTICO
- Indicador visual de severidad por color
- Botón deshabilitado durante petición en vuelo
- Formulario reactivo con validaciones

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
<button data-test-id="product-list-filter-category"></button>
<mat-paginator data-test-id="product-list-paginator"></mat-paginator>

<!-- Product Row -->
<tr data-test-id="product-row-ELEC-001"></tr>
<span data-test-id="product-stock-badge-ELEC-001"></span>

<!-- Alerts Panel -->
<div data-test-id="alerts-panel-list"></div>
<div data-test-id="alert-item-ELEC-001"></div>
<span data-test-id="alert-severity-ELEC-001"></span>

<!-- Movement Form -->
<form data-test-id="movement-form"></form>
<mat-select data-test-id="movement-form-product"></mat-select>
<mat-select data-test-id="movement-form-type"></mat-select>
<input data-test-id="movement-form-quantity"></input>
<input data-test-id="movement-form-reason"></input>
<button data-test-id="movement-form-submit"></button>

<!-- Navigation -->
<nav data-test-id="main-navigation"></nav>
<a data-test-id="nav-dashboard" routerLink="/dashboard"></a>
<a data-test-id="nav-products" routerLink="/products"></a>
<a data-test-id="nav-alerts" routerLink="/alerts"></a>
<a data-test-id="nav-movements" routerLink="/movements"></a>
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
| Filtro Categoría      | `product-list-filter-category`       |
| Paginador            | `product-list-paginator`             |
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
