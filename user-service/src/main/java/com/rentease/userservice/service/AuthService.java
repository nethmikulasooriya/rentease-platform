package com.rentease.userservice.service;

import com.rentease.userservice.dto.AuthResponse;
import com.rentease.userservice.dto.LoginRequest;
import com.rentease.userservice.dto.RefreshRequest;
import com.rentease.userservice.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(RefreshRequest request);
}
