package com.backen.url_shortner.controller;

import com.backen.url_shortner.models.UrlMapping;
import com.backen.url_shortner.service.UrlMappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class RedirectController {
    private final UrlMappingService urlMappingService;

    @GetMapping("/{shortUrl}")
    public ResponseEntity<?> redirect(@PathVariable String shortUrl){
        UrlMapping mapping = urlMappingService.getOriginalUrl(shortUrl);
        if(mapping != null){
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add("Location", mapping.getOriginalUrl());
            return ResponseEntity.status(302).headers(httpHeaders).build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
