package com.backen.url_shortner.dtos;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
//import java.time.LocalDateTime;

@Data
@Builder
public class ClickEventDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private LocalDate clickDate;
    private Long count;
}
