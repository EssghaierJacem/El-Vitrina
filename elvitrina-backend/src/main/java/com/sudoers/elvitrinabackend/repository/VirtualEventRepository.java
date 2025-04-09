package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import com.sudoers.elvitrinabackend.model.enums.EventMode;
import com.sudoers.elvitrinabackend.model.enums.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VirtualEventRepository extends JpaRepository<VirtualEvent, Long> {
    @Query("SELECT v FROM VirtualEvent v WHERE v.eventDate > :date ORDER BY v.eventDate ASC")
    List<VirtualEvent> findByEventDateAfterOrderByEventDateAsc(LocalDateTime date);


    List<VirtualEvent> findByEventTypeAndEventMode(EventType eventType, EventMode eventMode);
    List<VirtualEvent> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<VirtualEvent> findByEventDateAfterOrSessionsStartTimeAfter(LocalDateTime eventDate, LocalDateTime sessionStartTime);
}
