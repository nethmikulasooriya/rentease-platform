package com.rentease.catalogservice.repository;

import com.rentease.catalogservice.entity.VehicleAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehicleAvailabilityRepository extends JpaRepository<VehicleAvailability, Long> {
    List<VehicleAvailability> findByVehicleIdAndBlockedDateBetween(Long vehicleId, LocalDate start, LocalDate end);
    
    @Query("SELECT DISTINCT v.vehicleId FROM VehicleAvailability v WHERE v.blockedDate BETWEEN :start AND :end")
    List<Long> findBlockedVehicleIdsBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
