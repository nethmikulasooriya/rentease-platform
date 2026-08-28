package com.rentease.catalogservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ownerId;
    private String brand;
    private String model;
    private Integer year;
    private String category;
    private Integer seats;
    private String transmission;
    private String fuel;
    
    private Boolean hasAC = true;
    private Double dailyRateLKR;
    private Integer baseKmPerDay = 100;
    private Double extraRatePerKm = 45.0;
    
    private String city;
    private String district;
    private String description;
    
    private String status = "ACTIVE";
    private Double avgRating = 0.0;
    private Integer totalReviews = 0;
    private String primaryImageUrl;
    
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
