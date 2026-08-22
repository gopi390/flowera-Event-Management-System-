package com.flovera.controller;

import com.flovera.config.CurrentUserProvider;
import com.flovera.dto.BookingRequest;
import com.flovera.dto.BookingStatusUpdateRequest;
import com.flovera.model.*;
import com.flovera.repository.BookingRepository;
import com.flovera.repository.InvoiceRepository;
import com.flovera.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final InvoiceRepository invoiceRepository;
    private final CurrentUserProvider currentUserProvider;

    // Customer: create a new booking for a service/date
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest req) {
        User customer = currentUserProvider.getCurrentUser();

        EventService service = serviceRepository.findById(req.getServiceId())
                .orElse(null);
        if (service == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Service not found"));
        }
        if (!service.isAvailable()) {
            return ResponseEntity.badRequest().body(Map.of("message", "This service is currently unavailable"));
        }

        // Prevent double-booking the same service/hall on the same date
        boolean clash = bookingRepository.findByServiceIdAndEventDate(service.getId(), req.getEventDate())
                .stream().anyMatch(b -> b.getStatus() != BookingStatus.CANCELLED);
        if (clash) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "This service is already booked on the selected date"));
        }

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setService(service);
        booking.setEventDate(req.getEventDate());
        booking.setEventType(req.getEventType());
        booking.setNotes(req.getNotes());
        booking.setAmount(service.getPrice());
        booking.setStatus(BookingStatus.PENDING);
        Booking saved = bookingRepository.save(booking);

        // auto-generate an invoice for the booking
        Invoice invoice = new Invoice();
        invoice.setBooking(saved);
        invoice.setTotalAmount(service.getPrice());
        invoice.setPaidAmount(java.math.BigDecimal.ZERO);
        invoice.setDueAmount(service.getPrice());
        invoice.setPaymentStatus(PaymentStatus.UNPAID);
        invoiceRepository.save(invoice);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Customer: view their own bookings
    @GetMapping("/my")
    public List<Booking> myBookings() {
        User customer = currentUserProvider.getCurrentUser();
        return bookingRepository.findByCustomer(customer);
    }

    // Admin: view all bookings
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> allBookings() {
        return bookingRepository.findAll();
    }

    // Customer or Admin: view single booking (ownership enforced in service layer would be ideal;
    // kept simple here - customers can only reach their own via /my, admin via this endpoint)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        return bookingRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Admin: confirm/cancel/complete a booking
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody BookingStatusUpdateRequest req) {
        return bookingRepository.findById(id).map(b -> {
            b.setStatus(req.getStatus());
            return ResponseEntity.ok(bookingRepository.save(b));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Customer: cancel their own booking
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Object> cancelMyBooking(@PathVariable Long id) {
        User customer = currentUserProvider.getCurrentUser();
        return bookingRepository.findById(id).<ResponseEntity<Object>>map(b -> {
            if (!b.getCustomer().getId().equals(customer.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not your booking"));
            }
            b.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(b);
            return ResponseEntity.ok(b);
        }).orElse(ResponseEntity.notFound().build());
    }
}
