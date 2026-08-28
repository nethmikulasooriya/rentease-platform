package com.rentease.paymentservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name="escrows")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Escrow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long bookingId;
    
    private Double heldAmountLKR;
    private Double deductedAmountLKR = 0.0;
    private Double releasedAmountLKR = 0.0;
    private String status = "HELD";
    private LocalDateTime heldAt;
    private LocalDateTime releasedAt;
}
