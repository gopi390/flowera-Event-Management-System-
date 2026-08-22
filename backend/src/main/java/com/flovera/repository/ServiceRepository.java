package com.flovera.repository;

import com.flovera.model.EventService;
import com.flovera.model.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<EventService, Long> {
    List<EventService> findByCategory(ServiceCategory category);
    List<EventService> findByAvailableTrue();
}
