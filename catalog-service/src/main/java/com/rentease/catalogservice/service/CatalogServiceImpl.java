package com.rentease.catalogservice.service;

import com.rentease.catalogservice.dto.ReviewRequest;
import com.rentease.catalogservice.dto.VehicleRequest;
import com.rentease.catalogservice.dto.VehicleSearchRequest;
import com.rentease.catalogservice.entity.Review;
import com.rentease.catalogservice.entity.Vehicle;
import com.rentease.catalogservice.entity.VehicleAvailability;
import com.rentease.catalogservice.entity.VehicleImage;
import com.rentease.catalogservice.repository.ReviewRepository;
import com.rentease.catalogservice.repository.VehicleAvailabilityRepository;
import com.rentease.catalogservice.repository.VehicleImageRepository;
import com.rentease.catalogservice.repository.VehicleRepository;
import com.rentease.catalogservice.repository.VehicleSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogServiceImpl implements CatalogService {

    private final VehicleRepository vehicleRepository;
    private final VehicleImageRepository vehicleImageRepository;
    private final VehicleAvailabilityRepository availabilityRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public Page<Vehicle> searchVehicles(VehicleSearchRequest req) {
        Specification<Vehicle> spec = VehicleSpecification.buildFilter(
                req.getCategory(), req.getCity(), req.getDistrict(), req.getMinRate(), req.getMaxRate(),
                req.getHasAC(), req.getTransmission(), req.getFuel(), req.getMinSeats()
        );
        
        Sort sort = Sort.by(Sort.Direction.DESC, "avgRating");
        if ("PRICE_ASC".equals(req.getSortBy())) {
            sort = Sort.by(Sort.Direction.ASC, "dailyRateLKR");
        } else if ("PRICE_DESC".equals(req.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "dailyRateLKR");
        } else if ("RATING".equals(req.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "avgRating");
        }

        List<Vehicle> allVehicles = vehicleRepository.findAll(spec, sort);
        
        if (req.getMinRating() != null) {
            allVehicles = allVehicles.stream()
                    .filter(v -> v.getAvgRating() != null && v.getAvgRating() >= req.getMinRating())
                    .collect(Collectors.toList());
        }

        if (req.getStartDate() != null && req.getEndDate() != null) {
            LocalDate start = LocalDate.parse(req.getStartDate());
            LocalDate end = LocalDate.parse(req.getEndDate());
            List<Long> blockedIds = availabilityRepository.findBlockedVehicleIdsBetween(start, end);
            allVehicles = allVehicles.stream()
                    .filter(v -> !blockedIds.contains(v.getId()))
                    .collect(Collectors.toList());
        }

        int startIdx = req.getPage() * req.getSize();
        int endIdx = Math.min(startIdx + req.getSize(), allVehicles.size());
        List<Vehicle> pagedList = startIdx <= endIdx ? allVehicles.subList(startIdx, endIdx) : new ArrayList<>();

        return new PageImpl<>(pagedList, PageRequest.of(req.getPage(), req.getSize(), sort), allVehicles.size());
    }

    @Override
    public Vehicle getById(Long id) {
        return vehicleRepository.findById(id).orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    @Override
    public List<Vehicle> getByOwner(Long ownerId) {
        return vehicleRepository.findByOwnerId(ownerId);
    }

    @Override
    @Transactional
    public Vehicle createVehicle(VehicleRequest req) {
        if (req.getOwnerId() == null) {
            throw new IllegalArgumentException("Owner ID is required to create a vehicle");
        }

        Vehicle v = new Vehicle();
        v.setOwnerId(req.getOwnerId());
        v.setBrand(req.getBrand());
        v.setModel(req.getModel());
        v.setYear(req.getYear());
        v.setCategory(req.getCategory());
        v.setSeats(req.getSeats());
        v.setTransmission(req.getTransmission());
        v.setFuel(req.getFuel());
        v.setHasAC(req.getHasAC());
        v.setDailyRateLKR(req.getDailyRateLKR());
        v.setBaseKmPerDay(req.getBaseKmPerDay());
        v.setExtraRatePerKm(req.getExtraRatePerKm());
        v.setCity(req.getCity());
        v.setDistrict(req.getDistrict());
        v.setDescription(req.getDescription());
        v.setStatus(req.getStatus() != null ? req.getStatus() : "ACTIVE");
        v.setPrimaryImageUrl(req.getPrimaryImageUrl());

        return vehicleRepository.save(v);
    }

    @Override
    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle v) {
        Vehicle existing = getById(id);
        existing.setBrand(v.getBrand());
        existing.setModel(v.getModel());
        existing.setYear(v.getYear());
        existing.setCategory(v.getCategory());
        existing.setSeats(v.getSeats());
        existing.setTransmission(v.getTransmission());
        existing.setFuel(v.getFuel());
        existing.setHasAC(v.getHasAC());
        existing.setDailyRateLKR(v.getDailyRateLKR());
        existing.setBaseKmPerDay(v.getBaseKmPerDay());
        existing.setExtraRatePerKm(v.getExtraRatePerKm());
        existing.setCity(v.getCity());
        existing.setDistrict(v.getDistrict());
        existing.setDescription(v.getDescription());
        existing.setStatus(v.getStatus());
        existing.setPrimaryImageUrl(v.getPrimaryImageUrl());
        return vehicleRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    @Override
    @Transactional
    public VehicleImage addImage(Long vehicleId, String imageUrl, boolean isPrimary) {
        VehicleImage img = new VehicleImage();
        img.setVehicleId(vehicleId);
        img.setImageUrl(imageUrl);
        img.setIsPrimary(isPrimary);
        if (isPrimary) {
            Vehicle v = getById(vehicleId);
            v.setPrimaryImageUrl(imageUrl);
            vehicleRepository.save(v);
        }
        return vehicleImageRepository.save(img);
    }

    @Override
    @Transactional
    public void blockDates(Long vehicleId, List<LocalDate> dates, String reason) {
        List<VehicleAvailability> availabilities = dates.stream().map(d -> {
            VehicleAvailability va = new VehicleAvailability();
            va.setVehicleId(vehicleId);
            va.setBlockedDate(d);
            va.setReason(reason);
            return va;
        }).collect(Collectors.toList());
        availabilityRepository.saveAll(availabilities);
    }

    @Override
    @Transactional
    public void unblockDates(Long vehicleId, List<LocalDate> dates) {
        if (dates.isEmpty()) return;
        LocalDate start = dates.get(0);
        LocalDate end = dates.get(dates.size() - 1);
        List<VehicleAvailability> toRemove = availabilityRepository.findByVehicleIdAndBlockedDateBetween(vehicleId, start, end)
                .stream()
                .filter(va -> dates.contains(va.getBlockedDate()))
                .collect(Collectors.toList());
        availabilityRepository.deleteAll(toRemove);
    }

    @Override
    @Transactional
    public void markBooked(Long vehicleId, LocalDate start, LocalDate end) {
        List<LocalDate> dates = start.datesUntil(end.plusDays(1)).collect(Collectors.toList());
        blockDates(vehicleId, dates, "BOOKED");
    }

    @Override
    @Transactional
    public void markAvailable(Long vehicleId, LocalDate start, LocalDate end) {
        List<LocalDate> dates = start.datesUntil(end.plusDays(1)).collect(Collectors.toList());
        unblockDates(vehicleId, dates);
    }

    @Override
    public List<Vehicle> getSimilarVehicles(Long vehicleId) {
        Vehicle v = getById(vehicleId);
        Double minPrice = v.getDailyRateLKR() * 0.8;
        Double maxPrice = v.getDailyRateLKR() * 1.2;
        List<Vehicle> similar = vehicleRepository.findByCategoryAndStatusAndDistrictAndDailyRateLKRBetween(
                v.getCategory(), "ACTIVE", v.getDistrict(), minPrice, maxPrice
        );
        return similar.stream()
                .filter(sim -> !sim.getId().equals(vehicleId))
                .sorted((a, b) -> Double.compare(b.getAvgRating() != null ? b.getAvgRating() : 0.0, 
                                                 a.getAvgRating() != null ? a.getAvgRating() : 0.0))
                .limit(4)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Review addReview(ReviewRequest req) {
        Review r = new Review();
        r.setVehicleId(req.getVehicleId());
        r.setCustomerId(req.getCustomerId());
        r.setCustomerName(req.getCustomerName());
        r.setRating(req.getRating());
        r.setComment(req.getComment());
        reviewRepository.save(r);

        Vehicle v = getById(req.getVehicleId());
        v.setTotalReviews(v.getTotalReviews() + 1);
        Double avg = reviewRepository.findAvgRatingByVehicleId(req.getVehicleId());
        v.setAvgRating(avg);
        vehicleRepository.save(v);
        
        return r;
    }

    @Override
    public List<Review> getReviews(Long vehicleId) {
        return reviewRepository.findByVehicleId(vehicleId);
    }
}
