package com.rentease.paymentservice.repository;

import com.rentease.paymentservice.entity.Escrow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EscrowRepository extends JpaRepository<Escrow, Long> {
    Optional<Escrow> findByBookingId(Long bookingId);
}
