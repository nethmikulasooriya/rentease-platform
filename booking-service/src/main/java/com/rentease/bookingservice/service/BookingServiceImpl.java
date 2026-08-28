package com.rentease.bookingservice.service;

import com.rentease.bookingservice.entity.Booking;
import com.rentease.bookingservice.entity.Dispute;
import com.rentease.bookingservice.entity.OdometerLog;
import com.rentease.bookingservice.repository.BookingRepository;
import com.rentease.bookingservice.repository.DisputeRepository;
import com.rentease.bookingservice.repository.OdometerLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final OdometerLogRepository odometerLogRepository;
    private final DisputeRepository disputeRepository;
    private final PricingService pricingService;
    private final RestTemplate restTemplate;

    @Value("${catalog.service.url}")
    private String catalogServiceUrl;

    @Override
    @Transactional
    public Booking createBooking(Booking b) {
        b.setStatus("REQUESTED");
        double estimate = pricingService.calculateEstimate(b.getTotalDays(), b.getDailyRateLKR());
        b.setEstimatedCostLKR(estimate);
        b.setDepositAmountLKR(pricingService.calculateDeposit(estimate));
        return bookingRepository.save(b);
    }

    @Override
    public Booking getById(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Override
    public List<Booking> getByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Booking> getByOwner(Long ownerId) {
        return bookingRepository.findByOwnerId(ownerId);
    }

    @Override
    public List<Booking> getAll() {
        return bookingRepository.findAll();
    }

    @Override
    @Transactional
    public Booking approveBooking(Long id) {
        Booking b = getById(id);
        b.setStatus("APPROVED");
        bookingRepository.save(b);
        
        // Notify Catalog Service
        String url = catalogServiceUrl + "/api/v1/vehicles/" + b.getVehicleId() + "/mark-booked";
        Map<String, String> body = new HashMap<>();
        body.put("startDate", b.getStartDate().toString());
        body.put("endDate", b.getEndDate().toString());
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        
        restTemplate.postForLocation(url, request);
        return b;
    }

    @Override
    @Transactional
    public Booking rejectBooking(Long id, String reason) {
        Booking b = getById(id);
        b.setStatus("REJECTED");
        b.setRejectionReason(reason);
        return bookingRepository.save(b);
    }

    @Override
    @Transactional
    public Booking cancelBooking(Long id) {
        Booking b = getById(id);
        b.setStatus("CANCELLED");
        bookingRepository.save(b);
        
        // Notify Catalog Service
        String url = catalogServiceUrl + "/api/v1/vehicles/" + b.getVehicleId() + "/mark-available";
        Map<String, String> body = new HashMap<>();
        body.put("startDate", b.getStartDate().toString());
        body.put("endDate", b.getEndDate().toString());
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        
        restTemplate.postForLocation(url, request);
        return b;
    }

    @Override
    @Transactional
    public Booking markPaymentReceived(Long id) {
        Booking b = getById(id);
        b.setStatus("ACTIVE");
        return bookingRepository.save(b);
    }

    @Override
    @Transactional
    public OdometerLog logOdometer(Long bookingId, String type, Integer reading, String photoUrl, Long loggedBy) {
        OdometerLog log = new OdometerLog();
        log.setBookingId(bookingId);
        log.setType(type);
        log.setReading(reading);
        log.setPhotoUrl(photoUrl);
        log.setLoggedBy(loggedBy);
        return odometerLogRepository.save(log);
    }

    @Override
    public List<OdometerLog> getOdometerLogs(Long bookingId) {
        return odometerLogRepository.findByBookingId(bookingId);
    }

    @Override
    @Transactional
    public Booking completeBooking(Long id, Integer actualKm) {
        Booking b = getById(id);
        
        List<OdometerLog> logs = odometerLogRepository.findByBookingId(id);
        OdometerLog pickupLog = logs.stream().filter(l -> "PICKUP".equals(l.getType())).findFirst().orElse(null);
        
        if (pickupLog == null && actualKm == null) {
            throw new RuntimeException("Cannot calculate final cost without odometer reading");
        }
        
        double finalCost = pricingService.calculateFinalCost(
                b.getTotalDays(), b.getDailyRateLKR(), b.getBaseKmPerDay(), b.getExtraRatePerKm(), actualKm
        );
        b.setFinalCostLKR(finalCost);
        b.setStatus("COMPLETED");
        return bookingRepository.save(b);
    }

    @Override
    @Transactional
    public Booking raiseDispute(Long bookingId, Long raisedBy, String reason, String evidenceUrls) {
        Booking b = getById(bookingId);
        b.setStatus("DISPUTED");
        bookingRepository.save(b);
        
        Dispute d = new Dispute();
        d.setBookingId(bookingId);
        d.setRaisedBy(raisedBy);
        d.setReason(reason);
        d.setEvidenceUrls(evidenceUrls);
        disputeRepository.save(d);
        
        return b;
    }

    @Override
    @Transactional
    public Dispute resolveDispute(Long disputeId, String resolution, Long resolvedBy) {
        Dispute d = disputeRepository.findById(disputeId).orElseThrow(() -> new RuntimeException("Dispute not found"));
        d.setStatus("RESOLVED");
        d.setResolution(resolution);
        d.setResolvedBy(resolvedBy);
        d.setResolvedAt(LocalDateTime.now());
        return disputeRepository.save(d);
    }

    @Override
    public List<Dispute> getOpenDisputes() {
        return disputeRepository.findByStatus("OPEN");
    }
}
