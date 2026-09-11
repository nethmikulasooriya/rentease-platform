package com.rentease.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s.-]+$", message = "Name can only contain letters, spaces, dots, and hyphens")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        message = "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    )
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^(?:0|94|\\+94)?7[0-9]{8}$",
        message = "Invalid Sri Lankan phone number format (e.g. 07XXXXXXXX or +947XXXXXXXX)"
    )
    private String phone;

    private String role;

    private String licenseNumber;

    private String businessName;
}
