package com.rentease.notificationservice.dto;

import lombok.Data;
import java.util.Map;

@Data
public class NotificationRequest {
    private String toEmail;
    private String toName;
    private String subject;
    private String templateType;
    private Map<String, String> variables;
}
