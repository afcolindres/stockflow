# VERIFICATION.md - Verificación con JUnit

Esta guía proporciona instrucciones para crear tests automatizados con **JUnit 5** y **Mockito** para el proyecto inventory-service.

---

## 1. Configuración

### 1.1 Dependencias Maven

```xml
<dependencies>
    <!-- Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- H2 Test -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 1.2 Archivos de Configuración

- `src/test/resources/application.yml` - Configuración de tests

### 1.3 Estructura de Tests

```
src/test/java/com/stockflow/
├── controller/
│   ├── ProductControllerTest.java
│   ├── MovementControllerTest.java
│   └── AlertControllerTest.java
├── service/
│   ├── ProductServiceTest.java
│   ├── MovementServiceTest.java
│   └── AlertServiceTest.java
├── repository/
│   ├── ProductRepositoryTest.java
│   └── MovementRepositoryTest.java
└── integration/
    └── InventoryServiceIntegrationTest.java
```

---

## 2. Tipos de Tests

### 2.1 Tests Unitarios

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void shouldFindAllProducts() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setSku("SKU-001");
        product.setName("Laptop");
        product.setCategory("Electronica");
        product.setCurrentStock(10);
        product.setMinStock(5);
        product.setUnitPrice(BigDecimal.valueOf(999.99));

        when(productRepository.findAll()).thenReturn(Arrays.asList(product));

        // Act
        List<Product> result = productService.findAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("SKU-001", result.get(0).getSku());
    }

    @Test
    void shouldFindProductById() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setSku("SKU-001");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act
        Product result = productService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("SKU-001", result.getSku());
    }

    @Test
    void shouldCreateProduct() {
        // Arrange
        ProductRequestDto dto = new ProductRequestDto();
        dto.setSku("SKU-002");
        dto.setName("Mouse");
        dto.setCategory("Accesorios");
        dto.setCurrentStock(20);
        dto.setMinStock(10);
        dto.setUnitPrice(BigDecimal.valueOf(29.99));

        Product savedProduct = new Product();
        savedProduct.setId(2L);
        savedProduct.setSku(dto.getSku());
        savedProduct.setName(dto.getName());

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        // Act
        Product result = productService.create(dto);

        // Assert
        assertNotNull(result);
        assertEquals("SKU-002", result.getSku());
        verify(productRepository, times(1)).save(any(Product.class));
    }
}
```

### 2.2 Tests de Controlador

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    void shouldGetAllProducts() throws Exception {
        Product product = new Product();
        product.setId(1L);
        product.setSku("SKU-001");
        product.setName("Laptop");

        when(productService.findAll()).thenReturn(Arrays.asList(product));

        mockMvc.perform(get("/api/v1/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sku").value("SKU-001"));

        verify(productService, times(1)).findAll();
    }

    @Test
    void shouldGetProductById() throws Exception {
        Product product = new Product();
        product.setId(1L);
        product.setSku("SKU-001");

        when(productService.findById(1L)).thenReturn(product);

        mockMvc.perform(get("/api/v1/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sku").value("SKU-001"));
    }

    @Test
    void shouldReturn404WhenProductNotFound() throws Exception {
        when(productService.findById(999L)).thenReturn(null);

        mockMvc.perform(get("/api/v1/products/999"))
                .andExpect(status().isNotFound());
    }
}
```

---

## 3. Comandos

```bash
# Ejecutar todos los tests
mvn test

# Ejecutar un test específico
mvn test -Dtest=ProductServiceTest

# Ejecutar tests con coverage
mvn test -Dcoverage

# Ejecutar tests unitarios solo
mvn test -Dtest="*Test"

# Ejecutar tests de integración
mvn test -Dtest="*IntegrationTest"
```

---

## 4. Best Practices

### 4.1 Naming

- Archivos: `[Nombre]Test.java`
- Métodos: `should[ExpectedBehavior]` o `given[Input]_when[Action]_then[Result]`
- Paquetes: igual a los de código principal

### 4.2 Estructura AAA

```java
@Test
void shouldDoSomething() {
    // Arrange
    Object input = ...;

    // Act
    Object result = service.method(input);

    // Assert
    assertEquals(expected, result);
}
```

### 4.3 Cobertura

- **Objetivo**: > 70% coverage
- Verificar con `mvn test -Dcoverage`

---

## 5. Mocks

### 5.1 Repository Mock

```java
@Mock
private ProductRepository productRepository;
```

### 5.2 Service Mock

```java
@Mock
private ProductService productService;
```

### 5.3 Configuración de Mocks

```java
@BeforeEach
void setUp() {
    MockitoAnnotations.openMocks(this);
}
```

---

## 6. Errores Comunes

| Error                    | Solución                             |
| ------------------------ | ------------------------------------ |
| NullPointerException    | Inicializar mocks con @Mock         |
| Timeout                 | Aumentar timeout en test           |
| Database connection     | Usar H2 en memoria para tests        |
| Async callback          | Usar async/await correctamente      |
| Missing bean           | Usar @MockBean en controllers       |

---

## 7. Ejemplo Completo: MovementServiceTest

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovementServiceTest {

    @Mock
    private MovementRepository movementRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private MovementService movementService;

    @Test
    void shouldRegisterMovementIn() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setCurrentStock(10);
        product.setMinStock(5);

        MovementRequestDto dto = new MovementRequestDto();
        dto.setProductId(1L);
        dto.setType(MovementType.IN);
        dto.setQuantity(5);
        dto.setReason("Compra");

        when(productRepository.findById(1L())).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        Movement result = movementService.registerMovement(dto);

        // Assert
        assertNotNull(result);
        assertEquals(15, product.getCurrentStock());
        verify(movementRepository).save(any(Movement.class));
    }

    @Test
    void shouldRegisterMovementOut() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setCurrentStock(10);
        product.setMinStock(5);

        MovementRequestDto dto = new MovementRequestDto();
        dto.setProductId(1L);
        dto.setType(MovementType.OUT);
        dto.setQuantity(3);
        dto.setReason("Venta");

        when(productRepository.findById(1L())).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        Movement result = movementService.registerMovement(dto);

        // Assert
        assertNotNull(result);
        assertEquals(7, product.getCurrentStock());
    }

    @Test
    void shouldThrowInsufficientStockException() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setCurrentStock(2);
        product.setMinStock(5);

        MovementRequestDto dto = new MovementRequestDto();
        dto.setProductId(1L);
        dto.setType(MovementType.OUT);
        dto.setQuantity(10);
        dto.setReason("Venta");

        when(productRepository.findById(1L())).thenReturn(Optional.of(product));

        // Act & Assert
        assertThrows(InsufficientStockException.class, () -> {
            movementService.registerMovement(dto);
        });
    }
}
```

---

## 8. Tests de Integración

```java
@SpringBootTest
@AutoConfigureMockMvc
class InventoryServiceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void shouldRegisterMovementAndUpdateStock() throws Exception {
        // Create product first
        Product product = new Product();
        product.setSku("SKU-TEST");
        product.setName("Test Product");
        product.setCategory("Test");
        product.setCurrentStock(10);
        product.setMinStock(5);
        product.setUnitPrice(BigDecimal.valueOf(100));
        productRepository.save(product);

        // Register movement
        String json = """
            {
                "productId": 1,
                "type": "OUT",
                "quantity": 3,
                "reason": "Test"
            }
            """;

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());

        // Verify stock updated
        Product updated = productRepository.findById(1L).orElse(null);
        assertEquals(7, updated.getCurrentStock());
    }
}
```

---

## 9. Cobertura con JaCoCo

### Configuración pom.xml

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

### Generar Reporte

```bash
mvn jacoco:report
```

Reporte disponible en: `target/site/jacoco/index.html`

---

## 10. Notas

1. **Aislamiento**: Cada test debe ser independiente
2. **Limpieza**: Limpiar datos después de cada test
3. **Nombres descriptivos**: Usar nombres claros para tests
4. **AAA**: Arrange, Act, Assert
5. **Fast**: Tests deben ejecutarse rápido
6. **Cobertura**: Mantener > 70%