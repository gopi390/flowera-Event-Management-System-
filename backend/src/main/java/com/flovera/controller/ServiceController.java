package com.flovera.controller;

import com.flovera.dto.ServiceRequest;
import com.flovera.model.EventService;
import com.flovera.model.ServiceCategory;
import com.flovera.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceRepository serviceRepository;

    // Public - used by Home page (summary) and Services page (full catalog + calendar/address/amount)
    @GetMapping
    public List<EventService> getAllServices(@RequestParam(required = false) ServiceCategory category,
                                              @RequestParam(required = false) Boolean availableOnly) {
        if (category != null) {
            return serviceRepository.findByCategory(category);
        }
        if (Boolean.TRUE.equals(availableOnly)) {
            return serviceRepository.findByAvailableTrue();
        }
        return serviceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventService> getService(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---- Admin-only management ----

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventService> createService(@RequestBody ServiceRequest req) {
        EventService s = new EventService();
        applyRequest(s, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceRepository.save(s));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody ServiceRequest req) {
        return serviceRepository.findById(id).map(s -> {
            applyRequest(s, req);
            return ResponseEntity.ok(serviceRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin toggles service availability on/off
    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setAvailability(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        return serviceRepository.findById(id).map(s -> {
            s.setAvailable(Boolean.TRUE.equals(body.get("available")));
            return ResponseEntity.ok(serviceRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin sets/updates the payment (advance) limit for a service
    @PatchMapping("/{id}/payment-limit")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setPaymentLimit(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return serviceRepository.findById(id).map(s -> {
            Object limit = body.get("paymentLimit");
            if (limit != null) {
                s.setPaymentLimit(new java.math.BigDecimal(limit.toString()));
            }
            return ResponseEntity.ok(serviceRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        if (!serviceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        serviceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void applyRequest(EventService s, ServiceRequest req) {
        s.setName(req.getName());
        s.setCategory(req.getCategory());
        s.setDescription(req.getDescription());
        s.setPrice(req.getPrice());
        s.setImageUrl(req.getImageUrl());
        s.setAddress(req.getAddress());
        s.setCapacity(req.getCapacity());
        if (req.getPaymentLimit() != null) s.setPaymentLimit(req.getPaymentLimit());
        if (req.getAvailable() != null) s.setAvailable(req.getAvailable());
    }
}
