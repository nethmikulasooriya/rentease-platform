package com.rentease.bookingservice.service;

import org.springframework.stereotype.Service;

@Service
public class PricingService {

    public double calculateEstimate(int days, double dailyRate) {
        return days * dailyRate;
    }

    public double calculateFinalCost(int days, double dailyRate, int baseKmPerDay, double extraRatePerKm, int actualKm) {
        double baseCost = days * dailyRate;
        int allowedKm = baseKmPerDay * days;
        double extraKmCost = 0.0;
        if (actualKm > allowedKm) {
            extraKmCost = (actualKm - allowedKm) * extraRatePerKm;
        }
        return baseCost + extraKmCost;
    }

    public double calculateDeposit(double estimatedCost) {
        return estimatedCost * 0.3;
    }
}
