package com.rentease.userservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "owner_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long userId;

    private String businessName;
    private String bankAccount;
    
    private double commissionRate = 0.15;
    private double hostRating = 0.0;
    
    private boolean verified = false;
    private LocalDateTime verifiedAt;
}
