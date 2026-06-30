package com.backen.url_shortner.controller;

import com.backen.url_shortner.dtos.ClickEventDTO;
import com.backen.url_shortner.models.User;
import com.backen.url_shortner.repositories.UserRepository;
import com.backen.url_shortner.service.UrlMappingService;
import com.backen.url_shortner.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
public class UrlMappingController {
    private final UserService userService;
    private final UrlMappingService urlMappingService;

    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createShortUrl(@RequestBody Map<String, String> req, Principal principal){
        String originalUrl = req.get("originalUrl");
        User user = userService.findByUsername(principal.getName());
        if(user == null) throw new UsernameNotFoundException("Username not found!");
        return ResponseEntity.ok(urlMappingService.createShortUrl(originalUrl, user));
    }

    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUrlAnalytics(@PathVariable String shortUrl, @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate, Principal principal){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);

        List<ClickEventDTO> dtos = urlMappingService.getClickEventsByDate(shortUrl, start, end);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/totalClicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getTotalClicksByDate(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate, Principal principal){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        LocalDate end = LocalDate.parse(endDate, formatter);
        LocalDate start = LocalDate.parse(startDate, formatter);
        User user = userService.findByUsername(principal.getName());
        Map<LocalDate, Long> dtos = urlMappingService.getTotalClicksByUserAndDate(start, end, user);
        return ResponseEntity.ok(dtos);
    }
}
