# inventory-app

## Descripción

SPA Angular 17+ para el monitoreo de inventario de productos. Este módulo consume el API REST de `inventory-service` y presenta el dashboard de monitoreo.

## Autor

**[Arnold Francisco Colindres Bertrand]**

- **Email:** [arnold_fcolindres@yahoo.com]
- **GitHub:** [github.com/afcolindres]

## Requisitos Previos

### Herramientas Esenciales

1. Instalar [Node.js](https://nodejs.org/) (versión 18+)
2. Instalar [Angular CLI](https://angular.io/):

```bash
npm install -g @angular/cli
```

## Pasos de Instalación

1. **Clonar el proyecto**:

```bash
git clone <url-del-repositorio>
cd inventory-app
```

2. **Instalar dependencias**:

```bash
npm install
```

3. **Iniciar el servidor de desarrollo**:

```bash
ng serve
```

4. **Abrir en el navegador**:

```
http://localhost:4200
```

## Comandos Disponibles

| Comando                 | Descripción                         |
| ----------------------- | ----------------------------------- |
| `npm start`             | Iniciar servidor de desarrollo      |
| `npm run build`         | Compilar el proyecto                |
| `npm run test`          | Ejecutar tests unitarios (Jest)     |
| `npm run test:coverage` | Ejecutar tests con coverage (Jest)  |
| `npm run test:watch`    | Ejecutar tests en modo watch (Jest) |

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   └── home/              # Componente Home (Hola Mundo)
│   ├── services/              # (para implementar después)
│   ├── models/               # (para implementar después)
│   ├── interceptors/          # (para implementar después)
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.config.ts
│   └── app.routes.ts
├── styles.css
├── index.html
└── main.ts
```

## Estado del Proyecto

**Estado**: Implementado

- [x] Estructura de carpetas
- [x] Componente "Hola Mundo"
- [x] US-001: Signals (completado)
- [x] US-002: Interceptor HTTP (completado)
- [x] US-003: Listado productos (completado)
- [x] US-004: Skeleton loaders (completado)
- [x] US-005: Panel alertas (completado)
- [x] US-006: Badge stock (completado)
- [x] US-007: Dashboard KPIs (completado)
- [x] US-008: localStorage (completado)
- [x] US-009: Formulario movimiento (completado)
- [x] US-010: Deshabilitar botón (pendiente)
- [x] US-011: Stock automático (pendiente)
- [x] US-012: @defer history (completado)
- [x] US-013: Endpoint estadísticas avanzadas (completado)

---

## Testing

### Framework

- **Pruebas Unitarias**: Jest
- **Mocks**: Angular TestBed
- **Coverage**: Jest Coverage

### Cobertura Mínima Requerida

- **Instrucciones**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

### Estructura de Tests

```
src/app/
├── components/
│   ├── dashboard/
│   │   └── dashboard.component.spec.ts
│   ├── product-list/
│   │   └── product-list.component.spec.ts
│   └── movement-form/
│       └── movement-form.component.spec.ts
└── services/
    ├── inventory.service.spec.ts
    └── inventory.store.spec.ts
```

### Ejecutar y Ver Reporte de Tests

1. **Ejecutar pruebas**:

```bash
npm run test
```

2. **Generar reporte de coverage**:

```bash
npm run test:coverage
```

3. **Ver reporte**:
   - Abrir en navegador: `coverage/lcov-report/index.html`
   - O usar extensión "Live Server" en VS Code

### Verificar Coverage (con threshold)

```bash
npm run test:coverage
```

Este comando:

1. Ejecuta las pruebas
2. Verifica que la cobertura cumpla el mínimo (70%)
3. Falla si no se cumple el threshold

## Notas

- Puerto por defecto: 4200
- API: Requiere que inventory-service esté corriendo en puerto 8080
- Framework: Angular 17+ con Standalone Components
- Estado: Signals con signal(), computed(), effect()
