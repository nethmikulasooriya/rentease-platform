package com.rentease.userservice.service;

import com.rentease.userservice.dto.AuthResponse;
import com.rentease.userservice.dto.LoginRequest;
import com.rentease.userservice.dto.RefreshRequest;
import com.rentease.userservice.dto.RegisterRequest;
import com.rentease.userservice.entity.CustomerProfile;
import com.rentease.userservice.entity.OwnerProfile;
import com.rentease.userservice.entity.Role;
import com.rentease.userservice.entity.User;
import com.rentease.userservice.repository.CustomerProfileRepository;
import com.rentease.userservice.repository.OwnerProfileRepository;
import com.rentease.userservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final OwnerProfileRepository ownerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository,
                           CustomerProfileRepository customerProfileRepository,
                           OwnerProfileRepository ownerProfileRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.userRepository = userRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.ownerProfileRepository = ownerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        user = userRepository.save(user);

        if (user.getRole() == Role.OWNER) {
            OwnerProfile op = new OwnerProfile();
            op.setUserId(user.getId());
            ownerProfileRepository.save(op);
        } else if (user.getRole() == Role.CUSTOMER) {
            CustomerProfile cp = new CustomerProfile();
            cp.setUserId(user.getId());
            customerProfileRepository.save(cp);
        }

        return createAuthResponse(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return createAuthResponse(user);
    }

    @Override
    public AuthResponse refresh(RefreshRequest request) {
        if (!jwtService.validateToken(request.getRefreshToken())) {
            throw new RuntimeException("Invalid refresh token");
        }

        String userIdStr = jwtService.getUserIdFromToken(request.getRefreshToken());
        User user = userRepository.findById(Long.parseLong(userIdStr))
                .orElseThrow(() -> new RuntimeException("User not found"));

        return createAuthResponse(user);
    }

    private AuthResponse createAuthResponse(User user) {
        AuthResponse response = new AuthResponse();
        response.setToken(jwtService.generateToken(user));
        response.setRefreshToken(jwtService.generateRefreshToken(user));
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        return response;
    }
}
