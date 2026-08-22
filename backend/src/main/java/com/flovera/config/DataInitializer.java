package com.flovera.config;

import com.flovera.model.*;
import com.flovera.repository.ServiceRepository;
import com.flovera.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${flovera.admin.email}")
    private String adminEmail;

    @Value("${flovera.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedServices();
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Flovera Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Seeded default admin: " + adminEmail + " / " + adminPassword);
        }
    }

    private void seedServices() {
        if (serviceRepository.count() > 0) return;

        serviceRepository.saveAll(java.util.List.of(
            svc("Grand Celebration Hall", ServiceCategory.PARTY_HALL,
                "Spacious air-conditioned hall ideal for marriages and receptions.",
                new BigDecimal("75000"), 500, "12 Anna Salai, Chennai"),
            svc("Garden Party Hall", ServiceCategory.PARTY_HALL,
                "Outdoor garden hall, perfect for birthday parties and small events.",
                new BigDecimal("25000"), 150, "45 ECR Road, Chennai"),
            svc("Elegant Flower Decoration", ServiceCategory.FLOWER_DECORATION,
                "Fresh flower stage and entrance decoration package.",
                new BigDecimal("15000"), null, null),
            svc("Premium Catering Service", ServiceCategory.CATERING,
                "Full-service catering with multi-cuisine menu, per plate pricing shown as package.",
                new BigDecimal("500"), null, null),
            svc("Food Court Setup", ServiceCategory.FOOD_COURT,
                "Live food court stalls - chaat, dessert, beverages counters.",
                new BigDecimal("30000"), null, null),
            svc("Professional DJ & Sound", ServiceCategory.DJ,
                "DJ, sound system, and lighting for the full event.",
                new BigDecimal("20000"), null, null),
            svc("Invitation Card Design & Print", ServiceCategory.INVITATION_CARD,
                "Custom designed invitation cards, printed and ready.",
                new BigDecimal("5000"), null, null),
            svc("Event Poster Design", ServiceCategory.EVENT_POSTER,
                "Custom event poster / banner design for promotion.",
                new BigDecimal("2500"), null, null)
        ));
    }

    private EventService svc(String name, ServiceCategory cat, String desc, BigDecimal price,
                              Integer capacity, String address) {
        EventService s = new EventService();
        s.setName(name);
        s.setCategory(cat);
        s.setDescription(desc);
        s.setPrice(price);
        s.setCapacity(capacity);
        s.setAddress(address);
        s.setAvailable(true);
        s.setPaymentLimit(price.multiply(new BigDecimal("0.5"))); // default: 50% advance limit
        return s;
    }
}
