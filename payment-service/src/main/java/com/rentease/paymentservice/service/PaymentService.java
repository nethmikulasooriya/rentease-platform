package com.rentease.paymentservice.service;

import com.rentease.paymentservice.entity.Escrow;
import com.rentease.paymentservice.entity.OwnerPayout;
import com.rentease.paymentservice.entity.PaymentTransaction;
import java.util.List;
import java.util.Map;

public interface PaymentService {
    PaymentTransaction initiatePayment(Long bookingId, Double amount, String type);
    Escrow holdDeposit(Long bookingId, Double depositAmount);
    Escrow releaseDeposit(Long bookingId, Double deductAmount);
    OwnerPayout createPayout(Long ownerId, Long bookingId, Double grossAmount);
    OwnerPayout processPayout(Long payoutId);
    List<OwnerPayout> getPendingPayouts();
    List<OwnerPayout> getOwnerPayouts(Long ownerId);
    List<PaymentTransaction> getBookingTransactions(Long bookingId);
    Map<String, Object> getDashboardStats();
}
