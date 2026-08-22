package com.flovera.repository;

import com.flovera.model.Booking;
import com.flovera.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer(User customer);
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByService_Id(Long serviceId);
    List<Booking> findByServiceIdAndEventDate(Long serviceId, LocalDate eventDate);
}
