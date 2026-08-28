package com.rentease.userservice.controller;

import com.rentease.userservice.entity.CustomerProfile;
import com.rentease.userservice.entity.Document;
import com.rentease.userservice.entity.OwnerProfile;
import com.rentease.userservice.entity.User;
import com.rentease.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        return ResponseEntity.ok(userService.updateProfile(id, updates));
    }

    @GetMapping("/{id}/owner-profile")
    public ResponseEntity<OwnerProfile> getOwnerProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getOwnerProfile(id));
    }

    @GetMapping("/{id}/customer-profile")
    public ResponseEntity<CustomerProfile> getCustomerProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getCustomerProfile(id));
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<Document> uploadDocument(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.uploadDocument(id, body.get("type"), body.get("fileUrl")));
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<Document>> getDocuments(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getDocuments(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<User> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.updateUserStatus(id, body.get("status")));
    }
}
