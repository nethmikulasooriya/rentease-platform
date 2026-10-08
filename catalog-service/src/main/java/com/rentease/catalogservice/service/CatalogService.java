package com.rentease.catalogservice.service;

import com.rentease.catalogservice.dto.ReviewRequest;
import com.rentease.catalogservice.dto.VehicleRequest;
import com.rentease.catalogservice.dto.VehicleSearchRequest;
import com.rentease.catalogservice.entity.Review;
import com.rentease.catalogservice.entity.Vehicle;
import com.rentease.catalogservice.entity.VehicleImage;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface CatalogService {
    Page<Vehicle> searchVehicles(VehicleSearchRequest req);
    Vehicle getById(Long id);
    List<Vehicle> getByOwner(Long ownerId);
    Vehicle createVehicle(VehicleRequest request);
    Vehicle updateVehicle(Long id, Vehicle v);
    void deleteVehicle(Long id);
    VehicleImage addImage(Long vehicleId, String imageUrl, boolean isPrimary);
    void blockDates(Long vehicleId, List<LocalDate> dates, String reason);
    void unblockDates(Long vehicleId, List<LocalDate> dates);
    void markBooked(Long vehicleId, LocalDate start, LocalDate end);
    void markAvailable(Long vehicleId, LocalDate start, LocalDate end);
    List<Vehicle> getSimilarVehicles(Long vehicleId);
    Review addReview(ReviewRequest req);
    List<Review> getReviews(Long vehicleId);
}
