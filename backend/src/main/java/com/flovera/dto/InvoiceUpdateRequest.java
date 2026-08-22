package com.flovera.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvoiceUpdateRequest {
    private BigDecimal paidAmount;
}
