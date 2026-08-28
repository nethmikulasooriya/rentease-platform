package com.rentease.bookingservice.repository;

import com.rentease.bookingservice.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long id);
    List<Booking> findByOwnerId(Long id);
    List<Booking> findByStatus(String status);
    List<Booking> findByVehicleIdAndStatusIn(Long vehicleId, List<String> statuses);
}
