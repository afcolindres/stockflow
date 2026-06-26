package com.stockflow.controller;

import com.stockflow.dto.ApiResponseWrapper;
import com.stockflow.dto.PageResponseDto;
import com.stockflow.dto.ProductResponseDto;
import com.stockflow.service.ProductService;
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
}