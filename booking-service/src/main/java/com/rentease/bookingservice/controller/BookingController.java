package com.rentease.bookingservice.controller;

import com.rentease.bookingservice.entity.Booking;
import com.rentease.bookingservice.entity.Dispute;
import com.rentease.bookingservice.entity.OdometerLog;
import com.rentease.bookingservice.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin("*")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/{id}")
    public Booking getById(@PathVariable Long id) {
        return bookingService.getById(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<Booking> getByCustomer(@PathVariable Long customerId) {
        return bookingService.getByCustomer(customerId);
    }

    @GetMapping("/owner/{ownerId}")
    public List<Booking> getByOwner(@PathVariable Long ownerId) {
        return bookingService.getByOwner(ownerId);
    }

    @GetMapping
    public List<Booking> getAll() {
        return bookingService.getAll();
    }

    @PutMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable Long id) {
        return bookingService.approveBooking(id);
    }

    @PutMapping("/{id}/reject")
    public Booking rejectBooking(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return bookingService.rejectBooking(id, body.get("reason"));
    }

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }

    @PutMapping("/{id}/payment-received")
    public Booking markPaymentReceived(@PathVariable Long id) {
        return bookingService.markPaymentReceived(id);
    }

    @PostMapping("/{id}/odometer")
    public OdometerLog logOdometer(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String type = (String) body.get("type");
        Integer reading = (Integer) body.get("reading");
        String photoUrl = (String) body.get("photoUrl");
        Long loggedBy = Long.valueOf(body.get("loggedBy").toString());
        return bookingService.logOdometer(id, type, reading, photoUrl, loggedBy);
    }

    @GetMapping("/{id}/odometer")
    public List<OdometerLog> getOdometerLogs(@PathVariable Long id) {
        return bookingService.getOdometerLogs(id);
    }

    @PutMapping("/{id}/complete")
    public Booking completeBooking(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        return bookingService.completeBooking(id, body.get("actualKm"));
    }

    @PostMapping("/{id}/dispute")
    public Booking raiseDispute(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Long raisedBy = Long.valueOf(body.get("raisedBy").toString());
        String reason = (String) body.get("reason");
        String evidenceUrls = (String) body.get("evidenceUrls");
        return bookingService.raiseDispute(id, raisedBy, reason, evidenceUrls);
    }

    @GetMapping("/disputes/open")
    public List<Dispute> getOpenDisputes() {
        return bookingService.getOpenDisputes();
    }

    @PutMapping("/disputes/{disputeId}/resolve")
    public Dispute resolveDispute(@PathVariable Long disputeId, @RequestBody Map<String, Object> body) {
        String resolution = (String) body.get("resolution");
        Long resolvedBy = Long.valueOf(body.get("resolvedBy").toString());
        return bookingService.resolveDispute(disputeId, resolution, resolvedBy);
    }
}
