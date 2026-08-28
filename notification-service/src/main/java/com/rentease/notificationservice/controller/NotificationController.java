package com.rentease.notificationservice.controller;

import com.rentease.notificationservice.dto.NotificationRequest;
import com.rentease.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin("*")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping({"/send", "/email"})
    public Map<String, String> sendNotification(@RequestBody NotificationRequest request) {
        notificationService.sendEmail(request);
        return Collections.singletonMap("message", "Notification sent");
    }
}
