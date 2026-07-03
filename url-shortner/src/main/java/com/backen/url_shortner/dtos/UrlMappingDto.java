package com.backen.url_shortner.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UrlMappingDto implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    private String originalUrl, shortUrl;
    private int clickCount;
    private LocalDateTime createdDate;
    private String username;
}
