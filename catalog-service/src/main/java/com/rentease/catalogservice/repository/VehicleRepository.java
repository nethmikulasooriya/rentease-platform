package com.rentease.catalogservice.repository;

import com.rentease.catalogservice.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {
    List<Vehicle> findByOwnerId(Long ownerId);
    List<Vehicle> findByStatus(String status);
    List<Vehicle> findByCategoryAndStatusAndDistrictAndDailyRateLKRBetween(String category, String status, String district, Double min, Double max);
    Page<Vehicle> findAll(Specification<Vehicle> spec, Pageable pageable);
}
