package com.backen.url_shortner.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class RegisterRequest {
    private String username, password, email;
    private Set<String> role;
}
