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
└── config/
    └── InventoryHealthIndicatorTest.java
```

---

## 2. Tipos de Tests

### 2.1 Tests Unitarios (Service)

```java
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void findAll_ReturnsPagedProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(product), pageable, 1);
        when(productRepository.findAll(pageable)).thenReturn(page);

        PageResponseDto<ProductResponseDto> result = productService.findAll(0, 10, null);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void findById_ExistingProduct_ReturnsProduct() {
        Product product = new Product();
        product.setId(1L);
        product.setSku("ELEC-001");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductResponseDto result = productService.findById(1L);

        assertNotNull(result);
        assertEquals("ELEC-001", result.getSku());
    }

    @Test
    void findById_NonExistingProduct_ThrowsException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> productService.findById(999L));
    }

    @Test
    void findAllCategories_ReturnsCategoryList() {
        when(productRepository.findAllCategories()).thenReturn(List.of("Electrónica", "Hogar"));

        List<String> result = productService.findAllCategories();

        assertEquals(2, result.size());
    }

    @Test
    void search_ReturnsMatchingProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.searchByQuery("laptop", pageable)).thenReturn(List.of(product));

        List<ProductResponseDto> result = productService.search("laptop", 10);

        assertNotNull(result);
    }
}
```

### 2.2 Tests de Controlador

```java
@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @Mock
    private MovementService movementService;

    @InjectMocks
    private ProductController productController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void getProducts_ReturnsProductList() throws Exception {
        ProductResponseDto product = new ProductResponseDto(1L, "ELEC-001", "Laptop", "Electrónica", 10, 5, new BigDecimal("1299.99"));
        PageResponseDto<ProductResponseDto> pageResponse = new PageResponseDto<>(List.of(product), 1, 0, 0, 10);
        when(productService.findAll(anyInt(), anyInt(), any())).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/products"))
                .andExpect(status().isOk());
    }

    @Test
    void getProductById_ExistingProduct_ReturnsProduct() throws Exception {
        when(productService.findById(1L)).thenReturn(productResponseDto);

        mockMvc.perform(get("/api/v1/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    void getProductById_NonExistingProduct_Returns404() throws Exception {
        when(productService.findById(999L)).thenThrow(new ProductNotFoundException(999L));

        mockMvc.perform(get("/api/v1/products/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getCategories_ReturnsCategoryList() throws Exception {
        when(productService.findAllCategories()).thenReturn(List.of("Electrónica"));

        mockMvc.perform(get("/api/v1/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void searchProducts_ReturnsMatchingProducts() throws Exception {
        when(productService.search(anyString(), anyInt())).thenReturn(List.of(productResponseDto));

        mockMvc.perform(get("/api/v1/products/search").param("q", "laptop"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void getProductStats_ReturnsStats() throws Exception {
        ProductStatsResponseDto stats = new ProductStatsResponseDto(1L, "Laptop", 5L, 3L, 2L, 1.5, LocalDateTime.now());
        when(movementService.getStats(1L)).thenReturn(stats);

        mockMvc.perform(get("/api/v1/products/1/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalMovements").value(5));
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

# Ejecutar tests de controller
mvn test -Dtest="*ControllerTest"

# Ejecutar tests de service
mvn test -Dtest="*ServiceTest"

# Ejecutar tests con coverage (JaCoCo)
mvn test
mvn jacoco:report
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
@ExtendWith(MockitoExtension.class)
class MovementServiceTest {

    @Mock
    private MovementRepository movementRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private MovementService movementService;

    @Test
    void registerMovement_In_IncreasesStock() {
        Product product = new Product();
        product.setId(1L);
        product.setCurrentStock(10);
        product.setMinStock(5);

        MovementRequestDto dto = new MovementRequestDto();
        dto.setProductId(1L);
        dto.setType(MovementType.IN);
        dto.setQuantity(5);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenAnswer(i -> i.getArgument(0));

        MovementResponseDto result = movementService.registerMovement(dto);

        assertNotNull(result);
        assertEquals(15, product.getCurrentStock());
    }

    @Test
    void registerMovement_Out_DecreasesStock() {
        Product product = new Product();
        product.setId(1L);
        product.setCurrentStock(10);
        product.setMinStock(5);

        MovementRequestDto dto = new MovementRequestDto();
        dto.setProductId(1L);
        dto.setType(MovementType.OUT);
        dto.setQuantity(3);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenAnswer(i -> i.getArgument(0));

        MovementResponseDto result = movementService.registerMovement(dto);

        assertNotNull(result);
        assertEquals(7, product.getCurrentStock());
    }

    @Test
    void registerMovement_Out_InsufficientStock_ThrowsException() {
        Product product = new Product();
        product.setId(1L);
        product.setCurrentStock(2);
        product.setMinStock(5);

        MovementRequestDto dto = new MovementRequestDto();
        dto.setProductId(1L);
        dto.setType(MovementType.OUT);
        dto.setQuantity(10);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class, () -> movementService.registerMovement(dto));
    }

    @Test
    void getHistory_ReturnsPagedMovements() {
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.findByProductIdOrderByTimestampDesc(1L, pageable))
                .thenReturn(new PageImpl<>(List.of(movement), pageable, 1));

        PageResponseDto<MovementResponseDto> result = movementService.getHistory(1L, pageable);

        assertNotNull(result);
    }

    @Test
    void getStats_ReturnsProductStatistics() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.findByProductIdOrderByTimestampDesc(eq(1L), any()))
                .thenReturn(new PageImpl<>(movements, PageRequest.of(0, 10), 2));

        ProductStatsResponseDto result = movementService.getStats(1L);

        assertNotNull(result);
        assertEquals(5L, result.getTotalMovements());
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
        Product product = new Product();
        product.setSku("SKU-TEST");
        product.setName("Test Product");
        product.setCategory("Test");
        product.setCurrentStock(10);
        product.setMinStock(5);
        product.setUnitPrice(BigDecimal.valueOf(100));
        productRepository.save(product);

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

        Product updated = productRepository.findById(1L).orElse(null);
        assertEquals(7, updated.getCurrentStock());
    }
}
```

## 8.1 Tests de AlertService

```java
@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private AlertService alertService;

    @Test
    void getAlerts_ReturnsProductsBelowMinStock() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setCurrentStock(3);
        product.setMinStock(5);

        when(productRepository.findAll()).thenReturn(List.of(product));

        List<StockAlertResponseDto> result = alertService.getAlerts();

        assertEquals(1, result.size());
        assertEquals(AlertSeverity.LOW, result.get(0).getSeverity());
    }

    @Test
    void getAlerts_CriticalStock_ReturnsCriticalSeverity() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setCurrentStock(1);
        product.setMinStock(5);

        when(productRepository.findAll()).thenReturn(List.of(product));

        List<StockAlertResponseDto> result = alertService.getAlerts();

        assertEquals(AlertSeverity.CRITICAL, result.get(0).getSeverity());
    }

    @Test
    void countCriticalAlerts_ReturnsCorrectCount() {
        Product p1 = new Product();
        p1.setCurrentStock(1);
        p1.setMinStock(5);

        Product p2 = new Product();
        p2.setCurrentStock(3);
        p2.setMinStock(5);

        when(productRepository.findAll()).thenReturn(List.of(p1, p2));

        long count = alertService.countCriticalAlerts();

        assertEquals(1, count);
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