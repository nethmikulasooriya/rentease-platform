package com.rentease.catalogservice.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long vehicleId;
    private Long customerId;
    private String customerName;
    private Integer rating;
    private String comment;
}
