# ANALISIS.md - Análisis de Desarrollo

## 1. Requisitos del Sistema

### Requisitos Funcionales

- **Gestión de Productos**: Listado con paginación y filtro por categoría
- **Detalle de Producto**: Obtener detalle de un producto por ID
- **Registro de Movimientos**: Registrar entradas y salidas de inventario
- **Alertas de Stock**: Visualizar productos con stock bajo el mínimo
- **Historial de Movimientos**: Ver historial de movimientos por producto
- **Dashboard**: KPIs en tiempo real

### Requisitos No Funcionales

- **Responsive/Multiplataforma**: Acceso desde múltiples dispositivos
- **Rendimiento**: Carga rápida con @defer
- **Tiempo Real**: Actualización de alertas al registrar movimiento
- **Persistencia**: Guardar filtros en localStorage

---

## 2. Entidades de Dominio

### IProduct

```typescript
interface IProduct {
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
interface IMovement {
  id: number;
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  timestamp: string;
}
```

### IStockAlert

```typescript
interface IStockAlert {
  productId: number;
  productName: string;
  currentStock: number;
  minStock: number;
  severity: 'LOW' | 'CRITICAL';
}
```

### IApiResponse<T>

```typescript
interface IApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
```

---

## 3. Flujo Principal (End-to-End)

### Flujo: Registrar Movimiento de Salida

```
1. Usuario selecciona producto
2. Usuario selecciona tipo: OUT (salida)
3. Usuario ingresa cantidad
4. Usuario ingresa razón
5. Sistema valida stock suficiente
6. Sistema registra movimiento
7. Sistema actualiza stock del producto
8. Sistema verifica si stock < minStock
9. Si stock < minStock: dispara alerta
10. UI muestra alerta si aplica
```

### Casos de Prueba del Flujo

| # | Escenario                                    | Resultado Esperado         |
|---| ------------------------------------------- | ---------------------- |
| 1 | Salida con stock suficiente                  | Stock actualizado      |
| 2 | Salida con stock insuficiente               | Error 422             |
| 3 | Entrada normal                           | Stock incrementado    |
| 4 | Movimiento genera alerta LOW              | Alerta mostrada       |
| 5 | Movimiento genera alerta CRITICAL        | Alerta crítica mostrada |

---

## 4. Casos de Uso

### UC-001: Listar Productos

- El usuario puede ver todos los productos paginados
- El usuario puede filtrar por categoría
- El usuario puede navegar entre páginas

### UC-002: Ver Detalle de Producto

- El usuario puede ver los detalles de un producto
- El usuario puede ver el historial de movimientos

### UC-003: Registrar Movimiento

- El usuario puede registrar una entrada (IN)
- El usuario puede registrar una salida (OUT)
- El sistema valida la cantidad
- El sistema actualiza el stock automáticamente

### UC-004: Ver Alertas

- El usuario puede ver todas las alertas activas
- Las alertas muestran severity diferenciada por color

### UC-005: Ver Historial

- El usuario puede ver el historial de movimientos de un producto
- El historial se carga con @defer (on interaction)

---

## 5. Vistas del Dashboard

### Vista: Dashboard (KPIs)

| KPI                          | Descripción                              |
| ---------------------------- | --------------------------------------- |
| Total de Productos           | Cantidad total de productos             |
| Alertas Activas              | Productos con stock < minStock           |
| Alertas Críticas            | Productos con stock <= minStock / 2       |
| Valor Total de Inventario     | Suma de (currentStock * unitPrice)       |

### Vista: Listado de Productos

| Campo           | Descripción                        |
| --------------- | --------------------------------- |
| SKU             | Código del producto               |
| Nombre         | Nombre del producto               |
| Categoría      | Categoría del producto           |
| Stock Actual   | Stock actual del producto        |
| Stock Mínimo   | Umbral de alerta                 |
| Precio Unitario| Precio por unidad                 |
| Estado Badge   | OK / BAJO / CRÍTICO              |

### Vista: Panel de Alertas

| Campo            | Descripción                       |
| ---------------- | -------------------------------- |
| Producto         | Nombre del producto              |
| Stock Actual     | Stock actual                     |
| Stock Mínimo     | Umbral de alerta                 |
| Severidad        | LOW / CRITICAL (color)          |

### Vista: Registro de Movimiento

| Campo        | Tipo      | Validación                  |
| ------------ | --------- | --------------------------- |
| Producto     | Select   | Obligatorio                 |
| Tipo         | Select   | IN o OUT                    |
| Cantidad     | Number   | > 0, máximo stock si OUT   |
| Razón        | Text     | Obligatorio                 |

---

## 6. Estados de Stock

| Estado    | Condición                           | Color   |
| --------- | ---------------------------------- | --------|
| OK        | currentStock > minStock            | Verde   |
| BAJO      | currentStock <= minStock          | Naranja |
| CRÍTICO   | currentStock <= minStock / 2      | Rojo    |

---

## 7. Integración con Backend

### Base URL

```
http://localhost:8080/api/v1
```

### Endpoints

| Método | Endpoint                      | Descripción                          |
| ------ | ---------------------------- | ----------------------------------- |
| GET    | /products                    | Listar productos (paginado)          |
| GET    | /products/{id}               | Obtener producto por ID              |
| POST   | /movements                   | Registrar movimiento              |
| GET    | /alerts                      | Listar alertas de stock             |
| GET    | /movements/{productId}/history | Historial de movimientos           |

---

## 8. Manejo de Errores

| Código HTTP | Escenario                  | Mensaje UI                        |
| ----------- | ------------------------ | -------------------------------- |
| 200         | Éxito                    | Operación exitosa               |
| 400         | Validación               | Error de validación              |
| 404         | No encontrado           | Producto no encontrado           |
| 422         | Stock insuficiente      | Stock insuficiente para salida    |
| 500         | Error interno           | Error interno del servidor        |

---

## 9. Requisitos No Funcionales

- **Rendimiento**: Carga de componentes con @defer
- **UX**: Skeleton loaders durante peticiones
- **Persistencia**: Filtros en localStorage
- **Reactividad**: Signals para estado en tiempo real
- **Accesibilidad**: Componentes accesibles