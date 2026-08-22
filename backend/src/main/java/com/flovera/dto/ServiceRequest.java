package com.flovera.dto;

import com.flovera.model.ServiceCategory;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServiceRequest {
    private String name;
    private ServiceCategory category;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String address;
    private Integer capacity;
    private BigDecimal paymentLimit;
    private Boolean available;
}
