package com.rentease.catalogservice.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VehicleResponse {
    private Long id;
    private Long ownerId;
    private String brand;
    private String model;
    private Integer year;
    private String category;
    private Integer seats;
    private String transmission;
    private String fuel;
    private Boolean hasAC;
    private Double dailyRateLKR;
    private Integer baseKmPerDay;
    private Double extraRatePerKm;
    private String city;
    private String district;
    private String description;
    private String status;
    private Double avgRating;
    private Integer totalReviews;
    private String primaryImageUrl;
    private LocalDateTime createdAt;
    
    private List<String> imageUrls;
}
