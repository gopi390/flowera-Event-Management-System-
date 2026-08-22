package com.flovera.controller;

import com.flovera.dto.InvoiceUpdateRequest;
import com.flovera.model.Invoice;
import com.flovera.model.PaymentStatus;
import com.flovera.model.Role;
import com.flovera.model.User;
import com.flovera.repository.BookingRepository;
import com.flovera.repository.InvoiceRepository;
import com.flovera.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    // All invoices - admin-only visibility (as required: payment/invoice access is admin panel only)
    @GetMapping("/invoices")
    public List<Invoice> allInvoices() {
        return invoiceRepository.findAll();
    }

    @GetMapping("/invoices/booking/{bookingId}")
    public ResponseEntity<Invoice> invoiceForBooking(@PathVariable Long bookingId) {
        return invoiceRepository.findByBooking_Id(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin records a payment received against an invoice; status recalculated automatically
    @PatchMapping("/invoices/{id}/pay")
    public ResponseEntity<Invoice> recordPayment(@PathVariable Long id, @RequestBody InvoiceUpdateRequest req) {
        return invoiceRepository.findById(id).map(inv -> {
            BigDecimal newPaid = inv.getPaidAmount().add(req.getPaidAmount());
            if (newPaid.compareTo(inv.getTotalAmount()) > 0) {
                newPaid = inv.getTotalAmount();
            }
            inv.setPaidAmount(newPaid);
            inv.setDueAmount(inv.getTotalAmount().subtract(newPaid));
            inv.setPaymentStatus(
                    newPaid.compareTo(BigDecimal.ZERO) == 0 ? PaymentStatus.UNPAID :
                    newPaid.compareTo(inv.getTotalAmount()) >= 0 ? PaymentStatus.PAID : PaymentStatus.PARTIAL
            );
            inv.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(invoiceRepository.save(inv));
        }).orElse(ResponseEntity.notFound().build());
    }

    // List all customers (admin oversight)
    @GetMapping("/customers")
    public List<User> allCustomers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.CUSTOMER)
                .toList();
    }

    // Quick stats for the admin dashboard
    @GetMapping("/summary")
    public java.util.Map<String, Object> summary() {
        long totalBookings = bookingRepository.count();
        long totalCustomers = userRepository.findAll().stream().filter(u -> u.getRole() == Role.CUSTOMER).count();
        BigDecimal totalRevenue = invoiceRepository.findAll().stream()
                .map(Invoice::getPaidAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalDue = invoiceRepository.findAll().stream()
                .map(Invoice::getDueAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return java.util.Map.of(
                "totalBookings", totalBookings,
                "totalCustomers", totalCustomers,
                "totalRevenue", totalRevenue,
                "totalDue", totalDue
        );
    }
}
