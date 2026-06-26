package com.stockflow.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("StockFlow API")
                        .version("1.0.0")
                        .description("API para gestión de inventario")
                        .contact(new Contact().name("Equipo StockFlow").email("dev@stockflow.com"))
                        .license(new License().name("Licencia Proprietaria").url("https://stockflow.com/license")));
    }
}