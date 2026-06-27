# STACK.md - Stack Técnico

## Tecnologías

- **Framework**: Angular 16+
- **Lenguaje**: TypeScript 5.x
- **UI**: Angular Material
- **Estado**: Signals (signal, computed, effect)
- **HTTP**: HttpClient con interceptores
- **Rutas**: Router con lazy loading
- **Forms**: Reactive Forms
- **Testing**: Jest / Jasmine + Karma

---

## Estructura del Proyecto

```
inventory-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   └── dashboard.component.html
│   │   │   ├── product-list/
│   │   │   │   ├── product-list.component.ts
│   │   │   │   └── product-list.component.html
│   │   │   ├── alerts-panel/
│   │   │   │   ├── alerts-panel.component.ts
│   │   │   │   └── alerts-panel.component.html
│   │   │   ├── movement-form/
│   │   │   │   ├── movement-form.component.ts
│   │   │   │   └── movement-form.component.html
│   │   │   └── movement-history/
│   │   │       ├── movement-history.component.ts
│   │   │       └── movement-history.component.html
│   │   ├── services/
│   │   │   ├── inventory.service.ts
│   │   │   ├── inventory.store.ts
│   │   │   └── toast.service.ts
│   │   ├── interceptors/
│   │   │   └── error.interceptor.ts
│   │   ├── models/
│   │   │   ├── product.model.ts
│   │   │   ├── movement.model.ts
│   │   │   └── alert.model.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── styles.css
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Descripción de Carpetas

### `src/app/components/`

**Propósito**: Componentes standalone de la interfaz
**Contenido**:

| Componente          | Descripción                         |
| ------------------ | ---------------------------------- |
| `dashboard/`       | KPI cards con signals               |
| `product-list/`    | Tabla de productos con filtros       |
| `alerts-panel/`    | Panel de alertas de stock           |
| `movement-form/`   | Formulario de movimiento reactivo     |
| `movement-history/`| Historial cargado con @defer    |

### `src/app/services/`

**Propósito**: Lógica de negocio y estado
**Contenido**:

| Servicio            | Descripción                         |
| ------------------ | ---------------------------------- |
| `inventory.service.ts` | Llamadas HTTP al API              |
| `inventory.store.ts`  | Estado global con Signals           |
| `toast.service.ts`  | Notificaciones toast              |

### `src/app/models/`

**Propósito**: Interfaces y tipos TypeScript
**Contenido**:

| Modelo               | Descripción                         |
| ------------------ | ---------------------------------- |
| `product.model.ts`  | IProduct, IProductResponse         |
| `movement.model.ts` | IMovement, IMovementRequest       |
| `alert.model.ts`    | IStockAlert                      |

### `src/app/interceptors/`

**Propósito**: Interceptores HTTP
**Contenido**:

| Interceptor          | Descripción                         |
| ------------------ | ---------------------------------- |
| `error.interceptor.ts` | Manejo de errores global          |

---

## Modelos de Datos

### IProduct

```typescript
export interface IProduct {
  id: number;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
}
```

### IMovement

```typescript
export interface IMovement {
  id: number;
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  timestamp: string;
}
```

### IMovementRequest

```typescript
export interface IMovementRequest {
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
}
```

### IStockAlert

```typescript
export interface IStockAlert {
  productId: number;
  productName: string;
  currentStock: number;
  minStock: number;
  severity: 'LOW' | 'CRITICAL';
}
```

### IApiResponse<T>

```typescript
export interface IApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
```

---

## Dependencias Principales

### Productivas

- `@angular/core`: 16+
- `@angular/router`: 16+
- `@angular/forms`: 16+
- `@angular/common/http`: 16+
- `@angular/material`: 16+

### Estado Reactivo

- **Signals**: Integrados en Angular 16+

### UI & Estilos

- `@angular/material`: Componentes UI
- `rxjs`: Operaciones asíncronas

### Testing

- `@angular/core`: Testing
- `jasmine`: Framework de testing
- `karma`: Test runner

---

## Configuración de Rutas

```typescript
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./components/product-list/product-list.component')
      .then(m => m.ProductListComponent)
  },
  {
    path: 'alerts',
    loadComponent: () => import('./components/alerts-panel/alerts-panel.component')
      .then(m => m.AlertsPanelComponent)
  },
  {
    path: 'movements',
    loadComponent: () => import('./components/movement-form/movement-form.component')
      .then(m => m.MovementFormComponent)
  }
];
```

---

## Configuración de Servicios

### inventory.store.ts (Signal-Based)

```typescript
@Injectable({ providedIn: 'root' })
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
  readonly criticalAlerts = computed(() =>
    this.alerts().filter(a => a.severity === 'CRITICAL').length
  );
  readonly totalValue = computed(() =>
    this.products().reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0)
  );

  constructor() {
    effect(() => {
      localStorage.setItem('filters', JSON.stringify(this.filters()));
    });

    effect(() => {
      const alerts = this.alerts();
      if (alerts.length > 0) {
        this.toastService.show(`${alerts.length} alertas activas`);
      }
    });
  }

  loadProducts(): Promise<void> { ... }
  loadAlerts(): Promise<void> { ... }
  createMovement(request: IMovementRequest): Promise<void> { ... }
}
```

---

## @defer para Vistas Diferidas

### Historial de Movimientos (on interaction)

```html
@defer (on interaction(productCard)) {
  <app-movement-history [productId]="product.id" />
} @placeholder {
  <div class="skeleton"></div>
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
  <div class="skeleton"></div>
} @loading {
  <app-spinner />
} @error {
  <app-error-message />
}
```

---

## Interceptores HTTP

### error.interceptor.ts

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = error.error?.message || 'Error desconocido';
      toastService.show(message, 'error');
      return throwError(() => error);
    })
  );
};
```

---

## Deploy

- **Plataforma**: Netlify / Vercel / any
- **Build**: `ng build`
- **Output**: `dist/inventory-app`
- **Puerto**: 4200 (default) o 3001

---

## Notas

1. **Standalone Components**: Todos los componentes son standalone
2. **Signals**: signal(), computed(), effect() para estado reactivo
3. **@defer**: Para carga diferida de historial y estadísticas
4. **lazy loading**: loadComponent para rutas
5. **inject()**: Para inyección de dependencias
6. **localStorage**: Persistir filtros activos
7. **Toast**: Notificaciones automáticas

---

## Atributos data-test-id para QA

Todos los componentes deben incluir `data-test-id` para facilitar pruebas de automatización.

### Convenciones

- Usar `data-test-id` en todos los elementos interactivos
- Patrón: `[componente]-[elemento]-[estado]`
- kebab-case para identificadores

### Ejemplos de Templates

```html
<!-- Dashboard KPI -->
<div data-test-id="dashboard-total-products">{{ totalProducts() }}</div>
<div data-test-id="dashboard-total-alerts">{{ alerts().length }}</div>

<!-- Product Table -->
<table data-test-id="product-list-table">
  <tr *ngFor="let product of products()"
      data-test-id="product-row-{{ product.sku }}">
    <td data-test-id="product-name">{{ product.name }}</td>
    <td data-test-id="product-stock-badge-{{ product.sku }}">
      {{ getStockStatus(product) }}
    </td>
  </tr>
</table>

<!-- Movement Form -->
<form data-test-id="movement-form">
  <select data-test-id="movement-form-product">...</select>
  <select data-test-id="movement-form-type">...</select>
  <input data-test-id="movement-form-quantity">
  <input data-test-id="movement-form-reason">
  <button data-test-id="movement-form-submit">Registrar</button>
</form>
```