package com.flovera.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long serviceId;
    private LocalDate eventDate;
    private String eventType;
    private String notes;
}
