package com.backen.url_shortner.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UrlMappingDto {
    private Long id;
    private String originalUrl, shortUrl;
    private int clickCount;
    private LocalDateTime createdDate;
    private String username;
}
