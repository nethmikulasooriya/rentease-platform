package com.rentease.notificationservice.service;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class EmailTemplateService {

    public String buildEmailBody(String templateType, Map<String, String> vars, String subject) {
        if (templateType == null) {
            return subject;
        }
        
        switch (templateType) {
            case "BOOKING_REQUESTED":
                return "Dear " + vars.get("ownerName") + ", you have a new booking request from " + vars.get("customerName") + " for " + vars.get("vehicleName") + " from " + vars.get("startDate") + " to " + vars.get("endDate") + ". Log in to approve or reject.";
            case "BOOKING_APPROVED":
                return "Dear " + vars.get("customerName") + ", great news! Your booking for " + vars.get("vehicleName") + " from " + vars.get("startDate") + " to " + vars.get("endDate") + " has been approved. Total: LKR " + vars.get("amount") + ".";
            case "BOOKING_REJECTED":
                return "Dear " + vars.get("customerName") + ", unfortunately your booking for " + vars.get("vehicleName") + " was rejected. Reason: " + vars.get("reason") + ".";
            case "BOOKING_COMPLETED":
                return "Dear " + vars.get("customerName") + ", your trip is complete! Final cost: LKR " + vars.get("finalCost") + ". Thank you for using RentEase!";
            case "DOCUMENT_APPROVED":
                return "Dear " + vars.get("userName") + ", your document (" + vars.get("documentType") + ") has been verified and approved!";
            case "DOCUMENT_REJECTED":
                return "Dear " + vars.get("userName") + ", your document (" + vars.get("documentType") + ") was rejected. Note: " + vars.get("note") + ". Please re-upload.";
            case "PAYOUT_PROCESSED":
                return "Dear " + vars.get("ownerName") + ", your payout of LKR " + vars.get("netAmount") + " for booking #" + vars.get("bookingId") + " has been processed.";
            default:
                return subject;
        }
    }
}
