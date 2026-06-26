# StockFlow - Sistema de Monitoreo de Inventario

## Descripción

Aplicación web para el monitoreo de inventario de productos en tiempo real. Permite consultar el stock actual, recibir alertas cuando el inventario esté por debajo de los mínimos definidos y registrar movimientos (entradas y salidas) de mercancía.

**Prueba Técnica - Banco Cuscatlan**

---

## Autor

**[Arnold Francisco Colindres Bertrand]**

- **Email:** [arnold_fcolindres@yahoo.com]
- **GitHub:** [github.com/afcolindres]

---

## Requisitos Previos

### Herramientas Esenciales

| Herramienta  | Versión Mínima | Cómo Instalar                                                                                  | Documentación                                              |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Java JDK** | 17+            | `sdk install java 17.0.9-tem` (sdkman) o descarga directa de [Adoptium](https://adoptium.net/) | [Java 17 Docs](https://docs.oracle.com/en/java/javase/17/) |
| **Maven**    | 3.9+           | `sdk install maven` (sdkman) o [descarga directa](https://maven.apache.org/download.cgi)       | [Maven Docs](https://maven.apache.org/guides/)             |
| **Git**      | 2.30+          | [Descarga directa](https://git-scm.com/downloads)                                              | [Git Docs](https://git-scm.com/doc)                        |

### Instalar Java JDK 17 (Windows)

1. Descargar installer desde [Adoptium](https://adoptium.net/temurin/releases/)
2. Ejecutar el installer y seguir los pasos
3. Configurar variable de entorno `JAVA_HOME`:
   - Panel de Control > Sistema > Configuración avanzada del sistema > Variables de entorno
   - Nueva variable de sistema: `JAVA_HOME` = `C:\Program Files\Eclipse Adoptium\jdk-17.x.x`
4. Agregar al PATH: `%JAVA_HOME%\bin`

### Instalar Maven (Windows)

1. Descargar [apache-maven-3.9.x-bin.zip](https://maven.apache.org/download.cgi)
2. Extraer en `C:\Program Files\Apache\maven`
3. Configurar variable de entorno `MAVEN_HOME` = `C:\Program Files\Apache\maven`
4. Agregar al PATH: `%MAVEN_HOME%\bin`

### Instalar Git (Windows)

1. Descargar [Git for Windows](https://git-scm.com/download/win)
2. Ejecutar el installer
3. Seleccionar "Git Bash Here" y "Git GUI Here"

---

## Extensiones Recomendadas para VS Code

### Esenciales

| Extensión                      | ID                                     | Propósito                                                |
| ------------------------------ | -------------------------------------- | -------------------------------------------------------- |
| **Extension Pack for Java**    | `vscjava.vscode-java-pack`             | Soporte completo Java (IntelliSense, debugging, testing) |
| **Spring Boot Extension Pack** | `vscjava.vscode-spring-boot-dashboard` | Soporte Spring Boot (intellisense, snippets, dashboard)  |
| **Spring Boot Dashboard**      | `vscjava.spring-boot-dashboard`        | Panel para iniciar/detener servicios Spring              |
| **Thunder Client**             | `humao.thunder-client`                 | Testing de APIs REST (alternativa a Postman)             |

### Instalar Extensiones desde VS Code

1. Abrir VS Code
2. Ir a Extensions (`Ctrl+Shift+X`)
3. Buscar por nombre o ID
4. Clic en Install

### Configuración de VS Code

Crear archivo `.vscode/settings.json` en la raíz del proyecto:

```json
{
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-17",
      "path": "C:\\Program Files\\Eclipse Adoptium\\jdk-17.x.x",
      "default": true
    }
  ],
  "java.home": "C:\\Program Files\\Eclipse Adoptium\\jdk-17.x.x",
  "maven.executable.path": "C:\\Program Files\\Apache\\maven\\bin\\mvn.cmd",
  "java.import.gradle.java.home": "C:\\Program Files\\Eclipse Adoptium\\jdk-17.x.x",
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit"
  }
}
```

### Tareas de VS Code (Opcional)

Crear archivo `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Maven: Clean Install",
      "type": "shell",
      "command": "mvn clean install",
      "problemMatcher": [],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "label": "Maven: Spring Boot Run",
      "type": "shell",
      "command": "mvn spring-boot:run",
      "problemMatcher": [],
      "group": {
        "kind": "test",
        "isDefault": true
      }
    },
    {
      "label": "Maven: Run Tests",
      "type": "shell",
      "command": "mvn test",
      "problemMatcher": [],
      "group": "test"
    }
  ]
}
```

---

## Pasos para Inicializar el Proyecto

### 1. Clonar el Repositorio

```bash
git clone <repo-url>
cd stockflow
```

### 2. Navegar al Servicio

```bash
cd inventory-service
```

### 3. Instalar Dependencias

```bash
mvn clean install
```

### 4. Ejecutar el Servicio

```bash
mvn spring-boot:run
```

El servicio arrancará en `http://localhost:8080`

---

## Endpoints Principales

| Servicio             | URL                                      | Descripción                         |
| -------------------- | ---------------------------------------- | ----------------------------------- |
| **API REST**         | `http://localhost:8080/api/v1/`          | Endpoints de la aplicación          |
| **Swagger UI**       | `http://localhost:8080/swagger-ui.html`  | Documentación interactiva de la API |
| **H2 Console**       | `http://localhost:8080/h2-console`       | Consola de base de datos H2         |
| **Actuator Health**  | `http://localhost:8080/actuator/health`  | Estado de salud del servicio        |
| **Actuator Metrics** | `http://localhost:8080/actuator/metrics` | Métricas del servicio               |
| **Actuator Info**    | `http://localhost:8080/actuator/info`    | Información del servicio            |

### Endpoints API

| Endpoint                                | Método | Descripción                                            |
| --------------------------------------- | ------ | ------------------------------------------------------ |
| `/api/v1/products`                      | GET    | Listar productos con paginación y filtro por categoría |
| `/api/v1/products/{id}`                 | GET    | Obtener detalle de un producto                         |
| `/api/v1/movements`                     | POST   | Registrar movimiento (actualiza stock automáticamente) |
| `/api/v1/alerts`                        | GET    | Retornar productos con stock actual <= minStock        |
| `/api/v1/movements/{productId}/history` | GET    | Historial de movimientos por producto                  |

---

## Consideraciones Técnicas

### Stack Tecnológico

- **Backend**: Spring Boot 3.5+
- **ORM**: Spring Data JPA / Hibernate
- **Base de datos**: H2 (en memoria)
- **Connection Pooling**: HikariCP
- **Resilience**: Resilience4j (Circuit Breaker, Retry, Rate Limiter)
- **Documentación**: OpenAPI / Swagger
- **Actuator**: Spring Boot Actuator
- **Testing**: JUnit 5, Mockito

### Configuraciones Importantes

1. **HikariCP**: Connection pooling configurado en `application.yml`
2. **Resilience4j**:
   - Circuit Breaker en endpoint de alertas
   - Retry (3 intentos) en registro de movimientos
   - Rate Limiter (10 req/s) en historial de movimientos
3. **Spring Actuator**: Health, Metrics, Info expuestos
4. **Health Indicator**: Verifica si >20% productos en alerta crítica

### Arquitectura de Capas

```
┌─────────────────────────────────┐
│     Controller (REST API)        │
├─────────────────────────────────┤
│     Service (Lógica de negocio)    │
├─────────────────────────────────┤
│     Repository (JPA/Hibernate)   │
├─────────────────────────────────┤
│     Base de datos H2             │
└──────��──────────────────────────┘
```

### Separación de Responsabilidades

- **Controller**: Solo recibir requests y retornar responses
- **Service**: Lógica de negocio
- **Repository**: Acceso a datos

### Validaciones

- Bean Validation en DTOs (@NotNull, @NotBlank, @Min, @Max)
- Manejo global de excepciones con @RestControllerAdvice
- Códigos HTTP correctos: 200, 400, 404, 422, 500

---

## Comandos Útiles

```bash
# Desarrollo
mvn spring-boot:run

# Compilar
mvn clean compile

# Test
mvn test

# Test con cobertura
mvn test jacoco:report

# Build
mvn clean package

# Dependencias
mvn dependency:tree
```

---

## Datos Iniciales

El proyecto incluye datos de prueba en `data.sql` con:

- Mínimo 10 productos distribuidos en al menos 3 categorías:
  - Electrónica (laptops, teclados, mouse)
  - Redes (routers, switches, cables)
  - Accesorios (cámaras, discos, memorias)

---

## Licencia

Este proyecto es parte de una evaluación técnica confidencial.

---

## Tiempo Invertido

| Módulo            | Tiempo Estimado |
| ----------------- | --------------- |
| inventory-service | X horas         |
| inventory-app     | X horas         |
| **Total**         | X horas         |

---

## Decisiones Técnicas

[Documentar decisiones técnicas relevantes tomadas durante el desarrollo]
