# UI-GUIDE.md - Guía de Diseño UI/UX

## Objetivo

Establecer estándares de diseño para la SPA inventory-app con Angular Material y estilo moderno.

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
| OK        | `#2e7d32` | `#e8f5e9`        |
| BAJO      | `#F59020` | `#fff3e0`        |
| CRÍTICO   | `#E22827` | `#ffebee`       |

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

## Componentes UI (Angular Material)

### Cards (KPIs)

- Background: `#FFFFFF` (light) / `#1E2A3A` (dark)
- Border radius: 12px
- Box shadow: `0 2px 8px rgba(0,0,0,0.1)`
- Padding: 16px

### Badges de Estado

| Badge   | Background | Color Texto | Borde    |
| --------| ---------- | ----------- | --------|
| OK      | `#e8f5e9`  | `#2e7d32`  | none    |
| BAJO    | `#fff3e0`  | `#F59020`  | none    |
| CRÍTICO | `#ffebee` | `#E22827`  | none    |

### Tabla de Productos

- Header: Background `#f5f5f5`, font-weight 600
- Filas alternadas: Background `#fafafa`
- Hover: Background `#f0f0f0`
- Border radius: 8px

### Formulario de Movimiento

- Inputs con Angular Material (mat-form-field)
- Validation messages en color `#E22827`
- Botón primario: Background `#183473`, texto `#FFFFFF`
- Botón deshabilitado: Opacidad 0.5

---

## Angular Material Components

### componentes Recomendados

| Componente           | Uso                              |
| ------------------- | --------------------------------|
| `mat-card`          | KPIs del dashboard              |
| `mat-table`         | Listado de productos            |
| `mat-paginator`     | Paginación                     |
| `mat-form-field`    | Inputs del formulario          |
| `mat-select`        | Select de producto y tipo      |
| `mat-input`         | Campos de texto                |
| `mat-button`        | Botones                        |
| `mat-raised-button` | Botones elevados              |
| `mat-flat-button`   | Botones planos                 |
| `mat-icon`          | Iconos                        |
| `mat-spinner`       | Loading indicator              |
| `mat-progress-bar`  | Progress bar                  |
| `mat-snack-bar`     | Notificaciones toast           |
| `mat-dialog`        | Diálogos                      |
| `mat-select`        | Dropdowns                     |

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

### Estilos

```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
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
| Success| `#e8f5e9`  | `#2e7d32`  | check_circle |
| Error  | `#ffebee`  | `#E22827`  | error      |
| Warning| `#fff3e0`  | `#F59020`  | warning    |
| Info   | `#e3f2fd`  | `#405BA7`  | info       |

---

## @defer Bloques

### @placeholder

```html
@placeholder {
  <div class="skeleton-loader"></div>
}
```

### @loading

```html
@loading {
  <mat-spinner diameter="40"></mat-spinner>
}
```

### @error

```html
@error {
  <mat-card class="error-card">
    <mat-icon>error</mat-icon>
    <p>Error al cargar los datos</p>
  </mat-card>
}
```

---

## Configuración de Angular Material

### app.config.ts

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
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

1. **Angular Material**: Usar componentes de Material para consistencia
2. **Signals**: Para estado reactivo
3. **@defer**: Para carga diferida de historial
4. **Skeleton**: Durante cargas HTTP
5. **Toast**: Para errores y notificaciones
6. **Dark Mode**: Opcional pero soportado