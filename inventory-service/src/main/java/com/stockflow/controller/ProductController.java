package com.stockflow.controller;

import com.stockflow.dto.ApiResponseWrapper;
import com.stockflow.dto.PageResponseDto;
import com.stockflow.dto.ProductResponseDto;
import com.stockflow.service.ProductService;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Products", description = "Gestión de productos de inventario")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @Operation(
            summary = "Listar productos",
            description = "Retorna una lista paginada de productos. Soporta filtro opcional por categoría."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de productos obtenida exitosamente"),
            @ApiResponse(responseCode = "400", description = "Parámetros de paginación inválidos")
    })
    @GetMapping("/products")
    public ApiResponseWrapper<PageResponseDto<ProductResponseDto>> getProducts(
            @Parameter(description = "Número de página (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Tamaño de página", example = "10")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Filtrar por categoría", example = "Electrónica")
            @RequestParam(required = false) String category
    ) {
        PageResponseDto<ProductResponseDto> products = productService.findAll(page, size, category);
        return new ApiResponseWrapper<>(200, "Obtención satisfactoria", products);
    }

    @Operation(
            summary = "Obtener producto por ID",
            description = "Retorna los detalles de un producto específico"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Producto encontrado"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @GetMapping("/products/{id}")
    public ApiResponseWrapper<ProductResponseDto> getProductById(
            @Parameter(description = "ID del producto", example = "1")
            @PathVariable Long id) {
        ProductResponseDto product = productService.findById(id);
        return new ApiResponseWrapper<>(200, "Obtención satisfactoria", product);
    }

    @Operation(
            summary = "Listar categorías",
            description = "Retorna todas las categorías disponibles"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de categorías obtenida exitosamente")
    })
    @GetMapping("/categories")
    public ApiResponseWrapper<List<String>> getCategories() {
        List<String> categories = productService.findAllCategories();
        return new ApiResponseWrapper<>(200, "Obtención satisfactoria", categories);
    }

    @Operation(
            summary = "Buscar productos",
            description = "Retorna una lista de productos que coinciden con el texto de búsqueda"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Búsqueda exitosa")
    })
    @GetMapping("/products/search")
    public ApiResponseWrapper<List<ProductResponseDto>> searchProducts(
            @Parameter(description = "Texto de búsqueda", example = "laptop")
            @RequestParam String q,

            @Parameter(description = "Límite de resultados", example = "20")
            @RequestParam(defaultValue = "20") int limit
    ) {
        List<ProductResponseDto> products = productService.search(q, limit);
        return new ApiResponseWrapper<>(200, "Búsqueda satisfactoria", products);
    }
}