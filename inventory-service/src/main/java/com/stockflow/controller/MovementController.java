package com.stockflow.controller;

import com.stockflow.dto.ApiResponseWrapper;
import com.stockflow.dto.MovementRequestDto;
import com.stockflow.dto.MovementResponseDto;
import com.stockflow.service.MovementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Movements", description = "Gestión de movimientos de inventario")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @Operation(
            summary = "Registrar movimiento de inventario",
            description = "Registra un movimiento de entrada (IN) o salida (OUT) y actualiza el stock del producto automáticamente"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Movimiento registrado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Error de validación en los datos enviados"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
            @ApiResponse(responseCode = "422", description = "Stock insuficiente para realizar la salida")
    })
    @PostMapping("/movements")
    public ApiResponseWrapper<MovementResponseDto> createMovement(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            mediaType = "application/json",
                            examples = {
                                    @ExampleObject(
                                            name = "Entrada de inventario",
                                            value = "{\n  \"productId\": 1,\n  \"type\": \"IN\",\n  \"quantity\": 10,\n  \"reason\": \"Reposición de stock\"\n}"
                                    ),
                                    @ExampleObject(
                                            name = "Salida de inventario",
                                            value = "{\n  \"productId\": 1,\n  \"type\": \"OUT\",\n  \"quantity\": 5,\n  \"reason\": \"Venta realizada\"\n}"
                                    )
                            }
                    )
            )
            @Valid @RequestBody MovementRequestDto request
    ) {
        MovementResponseDto movement = movementService.registerMovement(request);
        return new ApiResponseWrapper<>(201, "Movimiento registrado exitosamente", movement);
    }
}