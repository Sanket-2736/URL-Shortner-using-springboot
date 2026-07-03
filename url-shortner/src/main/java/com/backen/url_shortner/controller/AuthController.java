package com.backen.url_shortner.controller;

import com.backen.url_shortner.dtos.LoginRequest;
import com.backen.url_shortner.dtos.RegisterRequest;
import com.backen.url_shortner.dtos.UrlMappingDto;
import com.backen.url_shortner.models.User;
import com.backen.url_shortner.service.UrlMappingService;
import com.backen.url_shortner.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {
    private final UserService userService;
    private final UrlMappingService urlMappingService;

    @GetMapping("/test")
    public ResponseEntity<?> test(){
        return ResponseEntity.ok("Auth endpoint working!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest req){
        System.out.println("LOGIN API HIT");
        System.out.println(req);
        return ResponseEntity.ok(userService.authenticateUser(req));
    }

    @GetMapping("/my-urls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserUrls(Principal principal){
        User user = userService.findByUsername(principal.getName());
        if(user == null){
            return ResponseEntity.status(404).body("User not found!");
        }

        List<UrlMappingDto> urls = urlMappingService.findUserUrls(user);
        return ResponseEntity.ok(urls);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest req){
        User user = User.builder()
                .email(req.getEmail())
                .username(req.getUsername())
                .role("ROLE_USER")
                .password(req.getPassword())
                .build();

        userService.registerUser(user);

        return ResponseEntity.ok("User created successfully!");
    }
}
