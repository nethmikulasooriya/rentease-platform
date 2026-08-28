package com.rentease.bookingservice.service;

import com.rentease.bookingservice.entity.Booking;
import com.rentease.bookingservice.entity.Dispute;
import com.rentease.bookingservice.entity.OdometerLog;

import java.util.List;

public interface BookingService {
    Booking createBooking(Booking b);
    Booking getById(Long id);
    List<Booking> getByCustomer(Long customerId);
    List<Booking> getByOwner(Long ownerId);
    List<Booking> getAll();
    Booking approveBooking(Long id);
    Booking rejectBooking(Long id, String reason);
    Booking cancelBooking(Long id);
    Booking markPaymentReceived(Long id);
    OdometerLog logOdometer(Long bookingId, String type, Integer reading, String photoUrl, Long loggedBy);
    List<OdometerLog> getOdometerLogs(Long bookingId);
    Booking completeBooking(Long id, Integer actualKm);
    Booking raiseDispute(Long bookingId, Long raisedBy, String reason, String evidenceUrls);
    Dispute resolveDispute(Long disputeId, String resolution, Long resolvedBy);
    List<Dispute> getOpenDisputes();
}
