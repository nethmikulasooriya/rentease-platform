package com.rentease.paymentservice.controller;

import com.rentease.paymentservice.entity.Escrow;
import com.rentease.paymentservice.entity.OwnerPayout;
import com.rentease.paymentservice.entity.PaymentTransaction;
import com.rentease.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin("*")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentTransaction initiatePayment(@RequestBody Map<String, Object> payload) {
        Long bookingId = Long.valueOf(payload.get("bookingId").toString());
        Double amount = Double.valueOf(payload.get("amount").toString());
        String type = payload.get("type").toString();
        return paymentService.initiatePayment(bookingId, amount, type);
    }

    @PostMapping("/deposit/hold")
    @ResponseStatus(HttpStatus.CREATED)
    public Escrow holdDeposit(@RequestBody Map<String, Object> payload) {
        Long bookingId = Long.valueOf(payload.get("bookingId").toString());
        Double depositAmount = Double.valueOf(payload.get("depositAmount").toString());
        return paymentService.holdDeposit(bookingId, depositAmount);
    }

    @PutMapping("/deposit/{bookingId}/release")
    public Escrow releaseDeposit(@PathVariable Long bookingId, @RequestBody Map<String, Object> payload) {
        Double deductAmount = Double.valueOf(payload.get("deductAmount").toString());
        return paymentService.releaseDeposit(bookingId, deductAmount);
    }

    @PostMapping("/payout")
    @ResponseStatus(HttpStatus.CREATED)
    public OwnerPayout createPayout(@RequestBody Map<String, Object> payload) {
        Long ownerId = Long.valueOf(payload.get("ownerId").toString());
        Long bookingId = Long.valueOf(payload.get("bookingId").toString());
        Double grossAmount = Double.valueOf(payload.get("grossAmount").toString());
        return paymentService.createPayout(ownerId, bookingId, grossAmount);
    }

    @PutMapping("/payout/{payoutId}/process")
    public OwnerPayout processPayout(@PathVariable Long payoutId) {
        return paymentService.processPayout(payoutId);
    }

    @GetMapping("/payout/pending")
    public List<OwnerPayout> getPendingPayouts() {
        return paymentService.getPendingPayouts();
    }

    @GetMapping("/payout/owner/{ownerId}")
    public List<OwnerPayout> getOwnerPayouts(@PathVariable Long ownerId) {
        return paymentService.getOwnerPayouts(ownerId);
    }

    @GetMapping("/booking/{bookingId}")
    public List<PaymentTransaction> getBookingTransactions(@PathVariable Long bookingId) {
        return paymentService.getBookingTransactions(bookingId);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {
        return paymentService.getDashboardStats();
    }
}
