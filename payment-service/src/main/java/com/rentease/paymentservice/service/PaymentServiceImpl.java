package com.rentease.paymentservice.service;

import com.rentease.paymentservice.entity.Escrow;
import com.rentease.paymentservice.entity.OwnerPayout;
import com.rentease.paymentservice.entity.PaymentTransaction;
import com.rentease.paymentservice.repository.EscrowRepository;
import com.rentease.paymentservice.repository.OwnerPayoutRepository;
import com.rentease.paymentservice.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentTransactionRepository transactionRepository;
    private final EscrowRepository escrowRepository;
    private final OwnerPayoutRepository payoutRepository;

    @Value("${platform.commission.rate}")
    private Double commissionRate;

    @Override
    public PaymentTransaction initiatePayment(Long bookingId, Double amount, String type) {
        PaymentTransaction tx = new PaymentTransaction();
        tx.setBookingId(bookingId);
        tx.setAmountLKR(amount);
        tx.setTransactionType(type);
        tx.setStatus("COMPLETED"); // Simulated gateway
        return transactionRepository.save(tx);
    }

    @Override
    public Escrow holdDeposit(Long bookingId, Double depositAmount) {
        Escrow escrow = new Escrow();
        escrow.setBookingId(bookingId);
        escrow.setHeldAmountLKR(depositAmount);
        escrow.setStatus("HELD");
        escrow.setHeldAt(LocalDateTime.now());
        return escrowRepository.save(escrow);
    }

    @Override
    public Escrow releaseDeposit(Long bookingId, Double deductAmount) {
        Escrow escrow = escrowRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Escrow not found"));
        escrow.setDeductedAmountLKR(deductAmount);
        escrow.setReleasedAmountLKR(escrow.getHeldAmountLKR() - deductAmount);
        escrow.setStatus(deductAmount > 0 ? "PARTIALLY_RELEASED" : "RELEASED");
        escrow.setReleasedAt(LocalDateTime.now());
        return escrowRepository.save(escrow);
    }

    @Override
    public OwnerPayout createPayout(Long ownerId, Long bookingId, Double grossAmount) {
        OwnerPayout payout = new OwnerPayout();
        payout.setOwnerId(ownerId);
        payout.setBookingId(bookingId);
        payout.setGrossAmountLKR(grossAmount);
        payout.setCommissionRate(commissionRate);
        payout.setCommissionAmountLKR(grossAmount * commissionRate);
        payout.setNetAmountLKR(grossAmount - payout.getCommissionAmountLKR());
        payout.setStatus("PENDING");
        payout.setCreatedAt(LocalDateTime.now());
        return payoutRepository.save(payout);
    }

    @Override
    public OwnerPayout processPayout(Long payoutId) {
        OwnerPayout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new RuntimeException("Payout not found"));
        payout.setStatus("PROCESSED");
        payout.setProcessedAt(LocalDateTime.now());
        return payoutRepository.save(payout);
    }

    @Override
    public List<OwnerPayout> getPendingPayouts() {
        return payoutRepository.findByStatus("PENDING");
    }

    @Override
    public List<OwnerPayout> getOwnerPayouts(Long ownerId) {
        return payoutRepository.findByOwnerId(ownerId);
    }

    @Override
    public List<PaymentTransaction> getBookingTransactions(Long bookingId) {
        return transactionRepository.findByBookingId(bookingId);
    }

    @Override
    public Map<String, Object> getDashboardStats() {
        List<PaymentTransaction> allTx = transactionRepository.findAll();
        double totalRevenue = allTx.stream()
                .filter(tx -> "COMPLETED".equals(tx.getStatus()) && "BOOKING_PAYMENT".equals(tx.getTransactionType()))
                .mapToDouble(PaymentTransaction::getAmountLKR)
                .sum();
        
        List<OwnerPayout> processedPayouts = payoutRepository.findByStatus("PROCESSED");
        double totalPayouts = processedPayouts.stream()
                .mapToDouble(OwnerPayout::getNetAmountLKR)
                .sum();
                
        long pendingPayouts = payoutRepository.findByStatus("PENDING").size();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalPayouts", totalPayouts);
        stats.put("pendingPayouts", pendingPayouts);
        return stats;
    }
}
