package com.backen.url_shortner.service;

import com.backen.url_shortner.dtos.LoginRequest;
import com.backen.url_shortner.jwt.JwtAuthenticationResponse;
import com.backen.url_shortner.jwt.JwtUtils;
import com.backen.url_shortner.models.User;
import com.backen.url_shortner.repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private JwtUtils jwtUtils;

    public JwtAuthenticationResponse authenticateUser(LoginRequest request){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        assert userDetails != null;
        String jwt = jwtUtils.generateToken(userDetails);
        log.info("User {} logged-in successfully!", request.getUsername());
        return new JwtAuthenticationResponse(jwt);
    }

    public void registerUser(User user){
        User existing = userRepository.findByUsername(user.getUsername()).orElse(null);
        if(existing != null){
            throw new RuntimeException("User already exists!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        log.info("User {} registered successfully!", user.getUsername());
        userRepository.save(user);
    }

    public User findByUsername(String username){
        log.info("User {} saved successfully!", username);
        return userRepository.findByUsername(username).orElse(null);
    }
}
