package com.stockflow.controller;

import com.stockflow.dto.ApiResponseWrapper;
import com.stockflow.dto.StockAlertResponseDto;
import com.stockflow.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Alerts", description = "Gestión de alertas de inventario")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @Operation(
            summary = "Consultar alertas de stock",
            description = "Retorna lista de productos con stock actual menor o igual al stock mínimo"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Alertas obtenidas exitosamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/alerts")
    public ApiResponseWrapper<List<StockAlertResponseDto>> getAlerts() {
        List<StockAlertResponseDto> alerts = alertService.getAlerts();
        return new ApiResponseWrapper<>(200, "Obtención satisfactoria", alerts);
    }
}