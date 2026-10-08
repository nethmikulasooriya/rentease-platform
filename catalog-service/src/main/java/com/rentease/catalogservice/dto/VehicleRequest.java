package com.rentease.catalogservice.dto;

import lombok.Data;

@Data
public class VehicleRequest {
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
    private String primaryImageUrl;

    public void setDailyRate(Double dailyRate) {
        this.dailyRateLKR = dailyRate;
    }
}
