package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.EventParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {
    List<EventParticipant> findByVirtualEventEventId(Long eventId);
    boolean existsByUserIdAndVirtualEventEventId(Long userId, Long eventId);
}