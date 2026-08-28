package com.rentease.notificationservice.service;

import com.rentease.notificationservice.dto.NotificationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JavaMailSender mailSender;
    private final EmailTemplateService templateService;

    public void sendEmail(NotificationRequest req) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(req.getToEmail());
            message.setSubject(req.getSubject());
            message.setText(templateService.buildEmailBody(req.getTemplateType(), req.getVariables(), req.getSubject()));
            
            mailSender.send(message);
            log.info("Email sent to {}", req.getToEmail());
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", req.getToEmail(), e.getMessage());
        }
    }
}
