package com.rentease.catalogservice.controller;

import com.rentease.catalogservice.dto.ReviewRequest;
import com.rentease.catalogservice.dto.VehicleRequest;
import com.rentease.catalogservice.dto.VehicleResponse;
import com.rentease.catalogservice.dto.VehicleSearchRequest;
import com.rentease.catalogservice.entity.Review;
import com.rentease.catalogservice.entity.Vehicle;
import com.rentease.catalogservice.entity.VehicleImage;
import com.rentease.catalogservice.repository.VehicleImageRepository;
import com.rentease.catalogservice.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/vehicles")
@CrossOrigin("*")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;
    private final VehicleImageRepository vehicleImageRepository;

    private VehicleResponse mapToResponse(Vehicle v) {
        VehicleResponse res = new VehicleResponse();
        res.setId(v.getId());
        res.setOwnerId(v.getOwnerId());
        res.setBrand(v.getBrand());
        res.setModel(v.getModel());
        res.setYear(v.getYear());
        res.setCategory(v.getCategory());
        res.setSeats(v.getSeats());
        res.setTransmission(v.getTransmission());
        res.setFuel(v.getFuel());
        res.setHasAC(v.getHasAC());
        res.setDailyRateLKR(v.getDailyRateLKR());
        res.setBaseKmPerDay(v.getBaseKmPerDay());
        res.setExtraRatePerKm(v.getExtraRatePerKm());
        res.setCity(v.getCity());
        res.setDistrict(v.getDistrict());
        res.setDescription(v.getDescription());
        res.setStatus(v.getStatus());
        res.setAvgRating(v.getAvgRating());
        res.setTotalReviews(v.getTotalReviews());
        res.setPrimaryImageUrl(v.getPrimaryImageUrl());
        res.setCreatedAt(v.getCreatedAt());

        List<String> images = vehicleImageRepository.findByVehicleId(v.getId())
                .stream().map(VehicleImage::getImageUrl).collect(Collectors.toList());
        res.setImageUrls(images);
        return res;
    }

    @GetMapping("/search")
    public Page<VehicleResponse> searchVehicles(@ModelAttribute VehicleSearchRequest req) {
        return catalogService.searchVehicles(req).map(this::mapToResponse);
    }

    @GetMapping("/{id}")
    public VehicleResponse getById(@PathVariable Long id) {
        return mapToResponse(catalogService.getById(id));
    }

    @GetMapping("/{id}/similar")
    public List<VehicleResponse> getSimilar(@PathVariable Long id) {
        return catalogService.getSimilarVehicles(id).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @GetMapping("/{id}/images")
    public List<VehicleImage> getImages(@PathVariable Long id) {
        return vehicleImageRepository.findByVehicleId(id);
    }

    @GetMapping("/{id}/reviews")
    public List<Review> getReviews(@PathVariable Long id) {
        return catalogService.getReviews(id);
    }

    @PostMapping("/{id}/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public Review addReview(@PathVariable Long id, @RequestBody ReviewRequest req) {
        req.setVehicleId(id);
        return catalogService.addReview(req);
    }

    @GetMapping("/owner/{ownerId}")
    public List<VehicleResponse> getByOwner(@PathVariable Long ownerId) {
        return catalogService.getByOwner(ownerId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Vehicle createVehicle(
            @RequestBody VehicleRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId
    ) {
        if (request.getOwnerId() == null && userId != null) {
            request.setOwnerId(userId);
        }
        return catalogService.createVehicle(request);
    }

    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return catalogService.updateVehicle(id, vehicle);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVehicle(@PathVariable Long id) {
        catalogService.deleteVehicle(id);
    }

    @PostMapping("/{id}/images")
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleImage addImage(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String imageUrl = (String) body.get("imageUrl");
        boolean isPrimary = body.containsKey("isPrimary") ? (Boolean) body.get("isPrimary") : false;
        return catalogService.addImage(id, imageUrl, isPrimary);
    }

    @PostMapping("/{id}/block-dates")
    public void blockDates(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        List<String> dateStrings = (List<String>) body.get("dates");
        List<LocalDate> dates = dateStrings.stream().map(LocalDate::parse).collect(Collectors.toList());
        String reason = body.containsKey("reason") ? (String) body.get("reason") : "OWNER_BLOCK";
        catalogService.blockDates(id, dates, reason);
    }

    @PostMapping("/{id}/unblock-dates")
    public void unblockDates(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        List<String> dateStrings = (List<String>) body.get("dates");
        List<LocalDate> dates = dateStrings.stream().map(LocalDate::parse).collect(Collectors.toList());
        catalogService.unblockDates(id, dates);
    }

    @PostMapping("/{id}/mark-booked")
    public void markBooked(@PathVariable Long id, @RequestBody Map<String, String> body) {
        LocalDate start = LocalDate.parse(body.get("startDate"));
        LocalDate end = LocalDate.parse(body.get("endDate"));
        catalogService.markBooked(id, start, end);
    }

    @PostMapping("/{id}/mark-available")
    public void markAvailable(@PathVariable Long id, @RequestBody Map<String, String> body) {
        LocalDate start = LocalDate.parse(body.get("startDate"));
        LocalDate end = LocalDate.parse(body.get("endDate"));
        catalogService.markAvailable(id, start, end);
    }
}
