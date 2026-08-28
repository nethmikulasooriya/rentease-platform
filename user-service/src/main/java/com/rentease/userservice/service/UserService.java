package com.rentease.userservice.service;

import com.rentease.userservice.entity.CustomerProfile;
import com.rentease.userservice.entity.Document;
import com.rentease.userservice.entity.OwnerProfile;
import com.rentease.userservice.entity.User;

import java.util.List;
import java.util.Map;

public interface UserService {
    User getById(Long id);
    User updateProfile(Long id, Map<String, String> updates);
    OwnerProfile getOwnerProfile(Long userId);
    CustomerProfile getCustomerProfile(Long userId);
    Document uploadDocument(Long userId, String type, String fileUrl);
    List<Document> getPendingDocuments();
    Document reviewDocument(Long docId, String status, String note, Long adminId);
    List<User> getAllUsers();
    User updateUserStatus(Long id, String status);
    List<Document> getDocuments(Long userId);
}
