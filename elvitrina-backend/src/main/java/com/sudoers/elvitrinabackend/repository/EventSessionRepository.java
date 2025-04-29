package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.EventSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventSessionRepository extends JpaRepository<EventSession, Long> {
    List<EventSession> findByVirtualEventEventId(Long eventId);
    List<EventSession> findByStartTimeAfter(LocalDateTime dateTime);
    @Query("SELECT es FROM EventSession es WHERE es.virtualEvent.eventId = :eventId AND es.sessionTitle = :title")
    List<EventSession> findByEventIdAndTitle(@Param("eventId") Long eventId, @Param("title") String title);}