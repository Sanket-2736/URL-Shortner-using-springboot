package com.backen.url_shortner.dtos;

import lombok.Data;

@Data
public class LoginRequest {
    private String username, password;
}
