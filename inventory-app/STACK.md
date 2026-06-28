# STACK.md - Stack Técnico

## Tecnologías

- **Framework**: Angular 17
- **Lenguaje**: TypeScript 5.x
- **UI**: CSS vanilla (sin frameworks)
- **Estado**: Signals (signal, computed, effect)
- **HTTP**: HttpClient con interceptores
- **Rutas**: Router con lazy loading
- **Forms**: Reactive Forms
- **Testing**: Jest

---

## Estructura del Proyecto

```
inventory-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.component.ts
│   │   │   ├── product-list/
│   │   │   │   └── product-list.component.ts
│   │   │   ├── product-detail/
│   │   │   │   └── product-detail.component.ts
│   │   │   ├── alerts-panel/
│   │   │   │   └── alerts-panel.component.ts
│   │   │   ├── movement-form/
│   │   │   │   └── movement-form.component.ts
│   │   │   ├── navbar/
│   │   │   │   └── navbar.component.ts
│   │   │   └── skeleton-loader/
│   │   │       └── skeleton-loader.component.ts
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
│   │   ├── mocks/
│   │   │   ├── products.mock.ts
│   │   │   ├── movements.mock.ts
│   │   │   ├── alerts.mock.ts
│   │   │   └── index.ts
│   │   ├── app.component.ts
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
| `product-detail/`  | Detalle de producto + historial    |
| `alerts-panel/`    | Panel de alertas de stock           |
| `movement-form/`   | Formulario de movimiento reactivo     |
| `navbar/`         | Barra de navegación                |
| `skeleton-loader/` | Loader esqueleto para loading      |

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
  productName?: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  timestamp: string;
  alert?: {
    productId: number;
    productName: string;
    currentStock: number;
    minStock: number;
    severity: 'LOW' | 'CRITICAL';
  };
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

### IProductStats

```typescript
export interface IProductStats {
  productId: number;
  productName: string;
  totalMovements: number;
  totalIn: number;
  totalOut: number;
  averagePerMonth: number;
  lastMovement: string | null;
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

- `@angular/core`: 17
- `@angular/router`: 17
- `@angular/forms`: 17
- `@angular/common/http`: 17

### Estado Reactivo

- **Signals**: Integrados en Angular 17

### UI & Estilos

- CSS vanilla (sin frameworks)
- `rxjs`: Operaciones asíncronas

### Testing

- `@angular/core`: Testing
- `jest`: Framework de testing
- `jest-preset-angular`: Preset para Angular

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
    path: 'products/:id',
    loadComponent: () => import('./components/product-detail/product-detail.component')
      .then(m => m.ProductDetailPage)
  },
  {
    path: 'alerts',
    loadComponent: () => import('./components/alerts-panel/alerts-panel.component')
      .then(m => m.AlertsPanelComponent)
  }
];
```

---

## Configuración de Servicios

### inventory.store.ts (Signal-Based)

```typescript
@Injectable({ providedIn: 'root' })
export class InventoryStore {
  private readonly products = signal<IProduct[]>([]);
  private readonly alerts = signal<IStockAlert[]>([]);
  private readonly selectedProduct = signal<IProduct | null>(null);
  private readonly loading = signal<boolean>(false);
  private readonly error = signal<string | null>(null);

  private readonly filters = signal<FilterState>({
    category: '',
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
  readonly criticalAlerts = computed(() =>
    this.alerts().filter(a => a.severity === 'CRITICAL').length
  );
  readonly totalStock = computed(() =>
    this.products().reduce((sum, p) => sum + p.currentStock, 0)
  );
  readonly totalValue = computed(() =>
    this.products().reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0)
  );

  constructor() {
    effect(() => {
      const currentFilters = this.filters();
      localStorage.setItem('inventory-filters', JSON.stringify(currentFilters));
    });

    effect(() => {
      const alerts = this.alerts();
      if (alerts.length > 0) {
        this.toastService.show(`${alerts.length} alertas activas`, 'info');
      }
    });

    this.loadFiltersFromStorage();
  }

  setFilters(filters: Partial<FilterState>): void { ... }
  async loadProducts(): Promise<void> { ... }
  async loadAlerts(): Promise<void> { ... }
  async loadCategories(): Promise<void> { ... }
  async createMovement(request: IMovementRequest): Promise<boolean> { ... }
  async searchProducts(query: string, limit?: number): Promise<IProduct[]> { ... }
  async getMovementHistory(productId: number, page?: number, size?: number): Promise<any> { ... }
  async getProductById(id: number): Promise<IProduct | null> { ... }
  async getProductStats(productId: number): Promise<IProductStats | null> { ... }
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
3. **lazy loading**: loadComponent para rutas
4. **inject()**: Para inyección de dependencias
5. **localStorage**: Persistir filtros activos (key: `inventory-filters`)
6. **Toast**: Notificaciones automáticas con tipo (success, error, warning, info)
7. **firstValueFrom**: Usar para convertir Observable a Promise
8. **readonly**: Todas las propiedades públicas de servicios y componentes deben ser `readonly`
9. **err: unknown**: Usar en catch blocks con type guard (`instanceof Error`) para acceder propiedades
10. **Modal**: MovementForm se abre como modal desde ProductList

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