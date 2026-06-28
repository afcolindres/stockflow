# VERIFICATION.md - Verificación con Jest/Jasmine

Esta guía proporciona instrucciones para crear tests automatizados con **Jest** o **Jasmine/Karma** para Angular.

---

## Formateo de Archivos de Test

**IMPORTANTE**: Todo archivo de test debe ser formateado con Prettier para evitar errores de style al hacer commit.

Ejecuta después de generar o modificar archivos:

```bash
npx prettier --write src/**/*.spec.ts
```

---

## 1. Preparación del Entorno

### 1.1 Requisitos

- **Angular**: 16+
- **Node.js**: Versión 18+
- **Jest** o **Jasmine/Karma** (incluidos en Angular)

### 1.2 Instalación

Angular ya incluye Jasmine/Karma por defecto. Para usar Jest:

```bash
npm install --save-dev jest @types/jest jest-preset-angular
```

### 1.3 Configuración

En `angular.json` (Jasmine/Karma):

```json
{
  "test": {
    "karmaConfig": "karma.conf.js",
    "polyfills": ["zone.js", "zone.js/testing"]
  }
}
```

En `jest.config.js` (Jest):

```javascript
module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.spec.ts"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

---

## 2. Cómo Solicitar Tests

### 2.1 Flujo de Trabajo

1. **El programador indica** qué Historia de Usuario (US) requiere pruebas
2. **El agente genera** los tests correspondientes en archivos `.spec.ts`
3. **Se ejecutan** con `ng test`

### 2.2 Formato de Solicitud

```
US-XXX: [Título]
Tests requeridos:
- [Criterio de aceptación 1]
- [Criterio de aceptación 2]
```

---

## 3. Estructura de un Test

### 3.1 Plantilla Base (Jasmine)

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardComponent } from "./dashboard.component";

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
```

### 3.2 Plantilla Base (Jest)

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardComponent } from "./dashboard.component";

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
```

### 3.3 Funciones Comunes

| Función                            | Descripción               |
| ---------------------------------- | ------------------------- |
| `TestBed.configureTestingModule()` | Configurar módulo de test |
| `TestBed.createComponent()`        | Crear componente          |
| `fixture.detectChanges()`          | Detectar cambios          |
| `fixture.nativeElement`            | Elemento DOM              |
| `component.signal()`               | Leer signal               |
| `expect().toBeTruthy()`            | Verificar que existe      |
| `expect().toEqual()`               | Verificar igualdad        |

---

## 4. Tipos de Tests por US

### 4.1 Test de Componente Standalone

```typescript
it("should display total products from signal", () => {
  store.products.set(mockProducts);
  fixture.detectChanges();

  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.querySelector(".total-products")).toContainText("15");
});
```

### 4.2 Test de Servicio

```typescript
it("should load products from API", () => {
  httpClientSpy.get.and.returnValue(of(mockProducts));

  service.loadProducts();

  expect(httpClientSpy.get).toHaveBeenCalledWith("/api/v1/products");
});
```

### 4.3 Test de Signal

```typescript
it("should compute total value correctly", () => {
  const totalValue = store.totalValue();
  expect(totalValue).toBe(15000);
});
```

### 4.4 Test de @defer

```typescript
it("should load history on interaction", (done) => {
  component.productId = 1;
  component.onProductClick();

  setTimeout(() => {
    expect(component.historyLoaded).toBe(true);
    done();
  }, 100);
});
```

### 4.5 Test de Formulario Reactivo

```typescript
it("should validate quantity field", () => {
  component.form.setValue({ quantity: -1 });
  expect(component.form.get("quantity")?.valid).toBeFalse();
});
```

### 4.6 Test de Interceptor

```typescript
it("should handle error response", () => {
  const error = new HttpErrorResponse({
    status: 422,
    error: { message: "Stock insuficiente" },
  });

  interceptor
    .intercept({} as HttpRequest<any>, {
      handle: () => throwError(() => error),
    })
    .subscribe({
      error: (err) => expect(err.status).toBe(422),
    });
});
```

---

## 5. Ejecución de Tests

### 5.1 Comandos

```bash
# Ejecutar todos los tests
ng test

# Ejecutar test específico
ng test --include="src/app/components/dashboard/**/*.spec.ts"

# Ejecutar con coverage
ng test --coverage

# Ejecutar con Jest
npm test
```

### 5.2 Coverage

```bash
# Coverage mínimo requerido: 70%
ng test --coverage --code-coverage
```

---

## 6. Tracking de Tests por US

| US     | Título                                          | Tests Creados | Ejecución | Estado    |
| ------ | ----------------------------------------------- | ------------- | --------- | --------- |
| US-001 | Configurar Signals para estado global           | [ ]           | [ ]       | Pendiente |
| US-002 | Interceptor HTTP para errores                | [ ]           | [ ]       | Pendiente |
| US-003 | Listado de productos con filtros y paginación | [ ]           | [ ]       | Pendiente |
| US-004 | Skeleton loaders durante peticiones         | [ ]           | [ ]       | Pendiente |
| US-005 | Panel de alertas con severidad visual        | [ ]           | [ ]       | Pendiente |
| US-006 | Badge de estado de stock en tiempo real  | [ ]           | [ ]       | Pendiente |
| US-007 | Dashboard con KPIs derivados de signals   | [ ]           | [ ]       | Pendiente |
| US-008 | Persistencia de filtros en localStorage  | [ ]           | [ ]       | Pendiente |
| US-009 | Registro de movimiento con formulario reactivo | [ ]           | [ ]       | Pendiente |
| US-010 | Deshabilitar botón durante petición      | [ ]           | [ ]       | Pendiente |
| US-011 | Actualización de stock automática      | [ ]           | [ ]       | Pendiente |
| US-012 | Carga diferida de historial con @defer   | [ ]           | [ ]       | Pendiente |
| US-013 | Endpoint de estadísticas avanzadas     | [ ]           | [ ]       | Pendiente |

---

## 7. Verificación Manual (Complementaria)

### 7.1 Navegación SPA

- [ ] URL cambia sin recarga de página
- [ ] Botón "atrás" vuelve a la vista anterior
- [ ] Lazy loading funciona correctamente

### 7.2 UI/UX

- [ ] Skeleton loader durante carga
- [ ] Badge de estado con colores correctos
- [ ] Toast de errores visible
- [ ] Botón deshabilitado durante petición

### 7.3 Signals

- [ ] KPIs se actualizan automáticamente
- [ ] Effect persiste filtros en localStorage
- [ ] Effect muestra toast de alertas

### 7.4 @defer

- [ ] Historial carga on interaction
- [ ] @placeholder muestra skeleton
- [ ] @loading muestra spinner
- [ ] @error muestra mensaje

### 7.5 Console (F12)

- [ ] Sin errores rojos
- [ ] Sin warnings de Angular

### 7.6 Responsividad

- [ ] Vista móvil funciona
- [ ] Tabla scrollable en móvil

---

## 8. Troubleshooting

| Problema                    | Solución                       |
| --------------------------- | ------------------------------ |
| Tests fallan aleatoriamente | Revisar async/await            |
| No encuentra elemento       | Usar `fixture.detectChanges()` |
| Error de red                | Verificar mock de HttpClient   |
| Timeout                     | Aumentar timeout en test       |
| Signal no actualiza         | Usar `set()` o `update()`      |

---

## 9. Notas del Proyecto

### URL de Desarrollo

- **Puerto**: 4200 (default) o 4200
- **Ruta base**: `http://localhost:4200`

### Rutas Principales para Tests

- `/dashboard` - Dashboard con KPIs
- `/products` - Listado de productos (grid con botones para modal de movimiento)
- `/alerts` - Panel de alertas

### Endpoints Consumidos

| Método | Endpoint                              | Descripción                       |
| ------ | ------------------------------------- | --------------------------------- |
| GET    | /api/v1/products                      | Lista de productos con paginación |
| GET    | /api/v1/alerts                        | Lista de alertas de stock         |
| POST   | /api/v1/movements                     | Registrar movimiento              |
| GET    | /api/v1/movements/{productId}/history | Historial de movimientos          |

### Selectores Comunes del Proyecto

- `.total-products` - Total de productos
- `.total-alerts` - Total de alertas
- `.total-value` - Valor total
- `.stock-badge` - Badge de estado
- `.product-table` - Tabla de productos
- `.movement-form` - Formulario de movimiento

### Convenciones de Interfaces

- **Prefijo**: Todas las interfaces usan prefijo "I" (ej: `IProduct`, `IMovement`, `IStockAlert`)
- **Archivos de tipos**: Located en `src/app/models/`

---

## 10. Selectores data-test-id para QA

Los tests deben usar selectores `data-test-id` para mayor estabilidad y mantenibilidad.

### Selectores por Componente

```typescript
// Dashboard
'[data-test-id="dashboard-total-products"]';
'[data-test-id="dashboard-total-alerts"]';
'[data-test-id="dashboard-critical-alerts"]';
'[data-test-id="dashboard-total-value"]';

// Product List
'[data-test-id="product-list-table"]';
'[data-test-id="product-list-filter-category"]';
'[data-test-id="product-list-paginator"]';
'[data-test-id="product-row-ELEC-001"]';
'[data-test-id="product-stock-badge-ELEC-001"]';

// Alerts Panel
'[data-test-id="alerts-panel-list"]';
'[data-test-id="alert-item-ELEC-001"]';
'[data-test-id="alert-severity-ELEC-001"]';

// Movement Form
'[data-test-id="movement-form"]';
'[data-test-id="movement-form-product"]';
'[data-test-id="movement-form-type"]';
'[data-test-id="movement-form-quantity"]';
'[data-test-id="movement-form-reason"]';
'[data-test-id="movement-form-submit"]';

// Navigation
'[data-test-id="nav-dashboard"]';
'[data-test-id="nav-products"]';
'[data-test-id="nav-alerts"]';
'[data-test-id="nav-movements"]';
```

### Ejemplo de Test con data-test-id

```typescript
it("should display total products", () => {
  store.products.set(mockProducts);
  fixture.detectChanges();

  const element = fixture.nativeElement.querySelector(
    '[data-test-id="dashboard-total-products"]',
  );
  expect(element.textContent).toContain("15");
});

it("should submit movement form", () => {
  component.form.setValue({
    productId: 1,
    type: "OUT",
    quantity: 5,
    reason: "Venta realizada",
  });

  component.submit();
  fixture.detectChanges();

  expect(service.createMovement).toHaveBeenCalled();
});
```
