# inventory-app

## Descripción

SPA Angular 17+ para el monitoreo de inventario de productos en tiempo real. Este módulo consume el API REST de `inventory-service` y presenta el dashboard de monitoreo.

## Autor

**[Arnold Francisco Colindres Bertrand]**

- **Email:** [arnold_fcolindres@yahoo.com]
- **GitHub:** [github.com/afcolindres]

## License

This project is licensed under the [MIT License](LICENSE).

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

| Comando                      | Descripción                    |
| ---------------------------- | ------------------------------ |
| `npm start`                  | Iniciar servidor de desarrollo |
| `npm run build`              | Compilar el proyecto           |
| `npm test`                   | Ejecutar tests unitarios       |
| `npm run test -- --coverage` | Ejecutar tests con coverage    |

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

**Estado**: Caparzón base creado

- [x] Estructura de carpetas
- [x] Componente "Hola Mundo"
- [ ] US-001: Signals (pendiente)
- [ ] US-002: Interceptor HTTP (pendiente)
- [ ] US-003: Listado productos (pendiente)
- [ ] US-004: Skeleton loaders (pendiente)
- [ ] US-005: Panel alertas (pendiente)
- [ ] US-006: Badge stock (pendiente)
- [ ] US-007: Dashboard KPIs (pendiente)
- [ ] US-008: localStorage (pendiente)
- [ ] US-009: Formulario movimiento (pendiente)
- [ ] US-010: Deshabilitar botón (pendiente)
- [ ] US-011: Stock automático (pendiente)
- [ ] US-012: @defer history (pendiente)

## Notas

- Puerto por defecto: 4200
- API: Requiere que inventory-service esté corriendo en puerto 8080
- Framework: Angular 17+ con Standalone Components
- Estado: Signals con signal(), computed(), effect()
