package com.rentease.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public GatewayConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r.path("/api/v1/auth/**", "/api/v1/users/**", "/api/v1/admin/documents/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("http://localhost:8081"))
                .route("catalog-service", r -> r.path("/api/v1/vehicles/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("http://localhost:8082"))
                .route("booking-service", r -> r.path("/api/v1/bookings/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("http://localhost:8083"))
                .route("payment-service", r -> r.path("/api/v1/payments/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("http://localhost:8084"))
                .build();
    }
}
