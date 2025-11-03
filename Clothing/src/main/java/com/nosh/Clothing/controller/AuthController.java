package com.nosh.Clothing.controller;

import com.nosh.Clothing.dto.request.AdminLoginRequest;
import com.nosh.Clothing.dto.request.GoogleLoginRequest;
import com.nosh.Clothing.dto.response.AuthResponse;
import com.nosh.Clothing.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/google-login")
    public ResponseEntity<AuthResponse> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        AuthResponse response = authService.googleLogin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin-login")
    public ResponseEntity<AuthResponse> adminLogin(@Valid @RequestBody AdminLoginRequest request) {
        AuthResponse response = authService.adminLogin(request);
        return ResponseEntity.ok(response);
    }
}
