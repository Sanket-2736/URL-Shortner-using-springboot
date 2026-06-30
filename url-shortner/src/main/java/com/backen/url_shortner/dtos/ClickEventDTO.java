package com.backen.url_shortner.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
//import java.time.LocalDateTime;

@Data
@Builder
public class ClickEventDTO {
    private LocalDate clickDate;
    private Long count;
}
