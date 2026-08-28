package com.rentease.userservice.controller;

import com.rentease.userservice.entity.Document;
import com.rentease.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/documents")
@CrossOrigin("*")
public class AdminDocumentController {

    private final UserService userService;

    public AdminDocumentController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Document>> getPendingDocuments() {
        return ResponseEntity.ok(userService.getPendingDocuments());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Document> approveDocument(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.reviewDocument(
                id, "APPROVED", body.get("note"), Long.parseLong(body.get("adminId"))));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Document> rejectDocument(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.reviewDocument(
                id, "REJECTED", body.get("note"), Long.parseLong(body.get("adminId"))));
    }
}
