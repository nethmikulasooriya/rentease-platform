package com.rentease.paymentservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name="owner_payouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerPayout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ownerId;
    private Long bookingId;
    private Double grossAmountLKR;
    private Double commissionRate;
    private Double commissionAmountLKR;
    private Double netAmountLKR;
    private String status = "PENDING";
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
}
