package com.flovera.controller;

import com.flovera.config.CurrentUserProvider;
import com.flovera.model.Booking;
import com.flovera.model.User;
import com.flovera.repository.BookingRepository;
import com.flovera.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final CurrentUserProvider currentUserProvider;
    private final BookingRepository bookingRepository;
    private final InvoiceRepository invoiceRepository;

    // Customer dashboard: their profile, their bookings, and each booking's invoice/payment status.
    @GetMapping("/me")
    public Map<String, Object> myDashboard() {
        User user = currentUserProvider.getCurrentUser();
        List<Booking> bookings = bookingRepository.findByCustomer(user);

        List<Map<String, Object>> bookingSummaries = bookings.stream().map(b -> {
            var invoice = invoiceRepository.findByBooking_Id(b.getId()).orElse(null);
            return Map.<String, Object>of(
                    "booking", b,
                    "invoice", invoice == null ? Map.of() : invoice
            );
        }).toList();

        return Map.of(
                "user", Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail(), "phone",
                        user.getPhone() == null ? "" : user.getPhone()),
                "bookings", bookingSummaries
        );
    }
}
