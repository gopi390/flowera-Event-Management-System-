package com.flovera.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Represents any bookable offering: party hall/room, marriage package,
 * birthday package, flower decoration, food court, catering, DJ,
 * photography, invitation card design, event poster design, etc.
 */
@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceCategory category;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    private String imageUrl;

    private String address;

    // relevant for PARTY_HALL category
    private Integer capacity;

    // maximum advance/payment amount admin allows for this service (payment limit control)
    private BigDecimal paymentLimit;

    @Column(nullable = false)
    private boolean available = true;
}
