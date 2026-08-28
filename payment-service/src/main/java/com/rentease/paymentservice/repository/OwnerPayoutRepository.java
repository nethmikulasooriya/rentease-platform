package com.rentease.paymentservice.repository;

import com.rentease.paymentservice.entity.OwnerPayout;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OwnerPayoutRepository extends JpaRepository<OwnerPayout, Long> {
    List<OwnerPayout> findByOwnerId(Long ownerId);
    List<OwnerPayout> findByStatus(String status);
}
