package com.nosh.Clothing.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.nosh.Clothing.dto.request.AdminLoginRequest;
import com.nosh.Clothing.dto.request.GoogleLoginRequest;
import com.nosh.Clothing.dto.response.AuthResponse;
import com.nosh.Clothing.dto.response.UserResponse;
import com.nosh.Clothing.exception.BadRequestException;
import com.nosh.Clothing.model.User;
import com.nosh.Clothing.repository.UserRepository;
import com.nosh.Clothing.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    public AuthResponse googleLogin(GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String googleId = payload.getSubject();

                User user = userRepository.findByGoogleId(googleId)
                        .orElseGet(() -> {
                            User newUser = new User();
                            newUser.setEmail(email);
                            newUser.setName(name);
                            newUser.setGoogleId(googleId);
                            newUser.setRole(User.Role.CUSTOMER);
                            return userRepository.save(newUser);
                        });

                UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password("")
                        .authorities("ROLE_" + user.getRole().name())
                        .build();

                String token = jwtUtil.generateToken(userDetails);
                UserResponse userResponse = mapToUserResponse(user);

                return new AuthResponse(token, userResponse);
            } else {
                throw new BadRequestException("Invalid Google token");
            }
        } catch (Exception e) {
            throw new BadRequestException("Google authentication failed: " + e.getMessage());
        }
    }

    public AuthResponse adminLogin(AdminLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (user.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Access denied");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);
            UserResponse userResponse = mapToUserResponse(user);

            return new AuthResponse(token, userResponse);
        } catch (Exception e) {
            throw new BadRequestException("Invalid credentials");
        }
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setAddress(user.getAddress());
        response.setRole(user.getRole());
        return response;
    }
}
