package com.rentease.catalogservice.dto;

import lombok.Data;

@Data
public class VehicleSearchRequest {
    private String category;
    private String city;
    private String district;
    private String startDate;
    private String endDate;
    private Double minRate;
    private Double maxRate;
    private Boolean hasAC;
    private String transmission;
    private String fuel;
    private Integer minSeats;
    private Integer minRating;
    private String sortBy = "RECOMMENDED";
    private Integer page = 0;
    private Integer size = 12;
}
