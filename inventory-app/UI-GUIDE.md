# UI-GUIDE.md - Guía de Diseño UI/UX

## Objetivo

Establecer estándares de diseño para la SPA inventory-app con CSS vanilla y estilo moderno.

---

## Paleta de Colores

### Colores Principales

| Nombre          | Hex       | Uso                                        |
| --------------- | --------- | ------------------------------------------ |
| Primary         | `#183473` | Gráficos, highlights, acciones principales |
| Primary Light   | `#3A63A7` | Hover                                      |
| Primary Dark    | `#142B5B` | Variante oscura                            |
| Secondary       | `#9c27b0` | Progreso, gráficos circulares              |
| Secondary Light| `#ba68c8` | Hover secundaria                           |
| Success         | `#2e7d32` | Estados completados, stock OK             |
| Success Light  | `#4caf50` | Variante clara                            |
| Warning         | `#F59020` | Stock bajo                                 |
| Warning Light  | `#F8A94D` | Variante clara                            |
| Danger          | `#E22827` | Stock crítico, errores                      |
| Danger Light    | `#E85C59` | Variante clara                            |
| Info            | `#405BA7` | Datos informativos                        |
| Info Light      | `#688BCF` | Variante clara                            |

### Colores de Estado

| Estado    | Color     | Background Badge |
| --------- | ----------| -----------------|
| OK        | `#155724` | `#d4edda`        |
| BAJO      | `#856404` | `#fff3cd`        |
| CRÍTICO   | `#721c24` | `#f8d7da`       |

### Colores de Severidad

| Severity  | Color     | Background       |
| ---------- | ----------| ----------------|
| LOW       | `#F59020` | `#fff3e0`       |
| CRITICAL  | `#E22827` | `#ffebee`       |

---

## Tipografía

### Familia de Fuentes

Font Family: 'Poppins', system-ui, -apple-system, sans-serif

### Jerarquía

| Elemento | Tamaño | Peso | Letter Spacing | Line Height |
| -------- | ------ | ---- | -------------- | ----------- |
| H1       | 32px   | 700  | -0.5px         | 1.2         |
| H2       | 24px   | 600  | -0.3px         | 1.3         |
| H3       | 20px   | 600  | -0.2px         | 1.4         |
| H4       | 16px   | 500  | 0px            | 1.4         |
| Body     | 14px   | 400  | 0px            | 1.5         |
| Small    | 12px   | 400  | 0.2px          | 1.4         |
| Caption  | 11px   | 400  | 0.3px          | 1.3         |

---

## Componentes UI (CSS Vanilla)

### Cards (KPIs)

- Background: `#FFFFFF`
- Border radius: 8px
- Box shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Padding: 24px

### Badges de Estado

| Badge   | Background | Color Texto | Borde    |
| --------| ---------- | ----------- | --------|
| OK      | `#d4edda`  | `#155724`  | none    |
| BAJO    | `#fff3cd`  | `#856404`  | none    |
| CRÍTICO | `#f8d7da` | `#721c24`  | none    |

### Tabla de Productos

- Header: Background `#f8f9fa`, font-weight 600
- Filas alternadas: Background `#fafafa`
- Hover: Background `#f8f9fa`
- Border radius: 8px (en table container)

### Formulario de Movimiento

- Inputs con CSS nativo
- Validation messages en color `#E22827`
- Botón primario: Background `#183473`, texto `#FFFFFF`
- Botón deshabilitado: Opacidad 0.5

---

## Componentes UI (Custom CSS)

### componentes Recomendados

| Componente           | Implementación                 |
| ------------------- | --------------------------------|
| `.kpi-card`         | KPIs del dashboard              |
| `.product-table`    | Listado de productos            |
| `.paginator`       | Paginación manual               |
| `.form-field`      | Inputs del formulario          |
| `<select>`          | Select nativo HTML             |
| `<input>`           | Campos de texto nativo          |
| `.btn`              | Botones personalizados           |
| `.btn-primary`      | Botones principales             |
| `.skeleton-loader`  | Loading skeleton               |
| `.toast`           | Notificaciones toast           |
| `.modal`           | Modal para movement-form         |

---

## Animaciones

### Transiciones

```css
--transition-fast: all 0.15s ease-out;
--transition-normal: all 0.3s ease;
--transition-slow: all 0.5s ease;
```

### Micro-interacciones

- Hover cards: `translateY(-2px)` + shadow
- Click buttons: `scale(0.97)`
- Focus inputs: glow
- Loading states: shimmer

---

## Layout y Espaciado

### Container

- Max width: 100% → 768px → 1280px
- Padding: 16px → 24px

### Espaciado

| Nombre | Valor |
| ------ | ----- |
| xs     | 4px   |
| sm     | 8px   |
| md     | 16px  |
| lg     | 24px  |
| xl     | 32px  |

---

## Responsive

### Breakpoints

| Nombre | Valor  |
| ------ | ------ |
| xs     | 0px    |
| sm     | 600px  |
| md     | 900px  |
| lg     | 1200px |
| xl     | 1536px |

---

## Skeleton Loaders

### Componente SkeletonLoader

```typescript
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  template: `
    <div class="skeleton-container">
      @for (item of rows |; track $index) {
        <div class="skeleton-row" [style.height]="rowHeight"></div>
      }
    </div>
  `,
  styles: [`
    .skeleton-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .skeleton-row {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() rows = 5;
  @Input() rowHeight = '48px';
  @Input() dataTestId = 'skeleton-loader';
}
```

### Uso

- Skeleton para tabla de productos
- Skeleton para panel de alertas
- Skeleton para KPIs del dashboard

---

## Toast Notifications

### Estilos

| Tipo    | Background  | Color Texto | Icono      |
|--------| ----------- | ----------- | ----------|
| Success| `#d4edda`  | `#155724`  | ✓         |
| Error  | `#f8d7da`  | `#721c24`  | ✕         |
| Warning| `#fff3cd`  | `#856404`  | ⚠         |
| Info   | `#cce5ff`  | `#004085`  | ℹ        |

---

## Configuración de app.config.ts

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor]))
  ]
};
```

---

## Dark Mode

### Implementación

```typescript
// En app.component.ts
@Component({
  selector: 'app-root',
  template: `
    <div [class.dark-theme]="darkMode()">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  darkMode = signal(false);
}
```

### Variables CSS

```css
.dark-theme {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
}
```

---

## Accesibilidad

### Requisitos

- Todos los inputs tienen `aria-label`
- Botones tienen `aria-describedby`
- Tabla tiene `aria-sort`
- Errores vinculados con `aria-describedby`
- Focus visible: `outline: 2px solid #183473`

---

## Notas Importantes

1. **CSS Vanilla**: Sin frameworks UI, estilos custom
2. **Signals**: Para estado reactivo
3. **Skeleton**: Durante cargas HTTP
4. **Toast**: Para errores y notificaciones (con tipos success/error/warning/info)
5. **Modal**: MovementForm se abre como modal
6. **Navbar**: Barra de navegación fija