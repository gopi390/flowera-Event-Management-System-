package com.flovera.dto;

import com.flovera.model.BookingStatus;
import lombok.Data;

@Data
public class BookingStatusUpdateRequest {
    private BookingStatus status;
}
