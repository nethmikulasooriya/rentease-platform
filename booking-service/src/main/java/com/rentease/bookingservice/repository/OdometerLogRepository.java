package com.rentease.bookingservice.repository;

import com.rentease.bookingservice.entity.OdometerLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OdometerLogRepository extends JpaRepository<OdometerLog, Long> {
    List<OdometerLog> findByBookingId(Long bookingId);
}
