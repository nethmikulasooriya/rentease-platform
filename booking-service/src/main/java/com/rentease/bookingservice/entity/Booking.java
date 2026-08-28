package com.rentease.bookingservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private Long vehicleId;
    private Long ownerId;
    
    private String customerName;
    private String vehicleName;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalDays;
    
    private String pickupLocation;
    private String dropoffLocation;
    
    private Boolean withDriver = false;
    
    private Double dailyRateLKR;
    private Integer baseKmPerDay;
    private Double extraRatePerKm;
    
    private Double estimatedCostLKR;
    private Double finalCostLKR;
    private Double depositAmountLKR;
    
    private String status = "REQUESTED";
    private String rejectionReason;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
