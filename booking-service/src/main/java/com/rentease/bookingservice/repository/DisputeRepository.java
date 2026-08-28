package com.rentease.bookingservice.repository;

import com.rentease.bookingservice.entity.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByBookingId(Long bookingId);
    List<Dispute> findByStatus(String status);
}
