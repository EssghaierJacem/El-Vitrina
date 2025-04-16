package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.EventSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventSessionRepository extends JpaRepository<EventSession, Long> {
    List<EventSession> findByVirtualEventEventId(Long eventId);
    List<EventSession> findByStartTimeAfter(LocalDateTime dateTime);
}