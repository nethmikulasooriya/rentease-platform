package com.rentease.userservice.service;

import com.rentease.userservice.entity.CustomerProfile;
import com.rentease.userservice.entity.Document;
import com.rentease.userservice.entity.OwnerProfile;
import com.rentease.userservice.entity.User;
import com.rentease.userservice.repository.CustomerProfileRepository;
import com.rentease.userservice.repository.DocumentRepository;
import com.rentease.userservice.repository.OwnerProfileRepository;
import com.rentease.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final OwnerProfileRepository ownerProfileRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final DocumentRepository documentRepository;

    public UserServiceImpl(UserRepository userRepository,
                           OwnerProfileRepository ownerProfileRepository,
                           CustomerProfileRepository customerProfileRepository,
                           DocumentRepository documentRepository) {
        this.userRepository = userRepository;
        this.ownerProfileRepository = ownerProfileRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.documentRepository = documentRepository;
    }

    @Override
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User updateProfile(Long id, Map<String, String> updates) {
        User user = getById(id);
        if (updates.containsKey("name")) user.setName(updates.get("name"));
        if (updates.containsKey("phone")) user.setPhone(updates.get("phone"));
        return userRepository.save(user);
    }

    @Override
    public OwnerProfile getOwnerProfile(Long userId) {
        return ownerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Owner profile not found"));
    }

    @Override
    public CustomerProfile getCustomerProfile(Long userId) {
        return customerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer profile not found"));
    }

    @Override
    public Document uploadDocument(Long userId, String type, String fileUrl) {
        Document doc = new Document();
        doc.setUserId(userId);
        doc.setDocumentType(type);
        doc.setFileUrl(fileUrl);
        return documentRepository.save(doc);
    }

    @Override
    public List<Document> getDocuments(Long userId) {
        return documentRepository.findByUserId(userId);
    }

    @Override
    public List<Document> getPendingDocuments() {
        return documentRepository.findByStatus("PENDING");
    }

    @Override
    public Document reviewDocument(Long docId, String status, String note, Long adminId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        doc.setStatus(status);
        doc.setReviewNote(note);
        doc.setReviewedBy(adminId);
        doc.setReviewedAt(LocalDateTime.now());
        return documentRepository.save(doc);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUserStatus(Long id, String status) {
        User user = getById(id);
        user.setStatus(status);
        return userRepository.save(user);
    }
}
