package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VirtualEventRepository extends JpaRepository<VirtualEvent, Long> {
    @Query("SELECT v FROM VirtualEvent v WHERE v.eventDate > :date ORDER BY v.eventDate ASC")
    List<VirtualEvent> findByEventDateAfterOrderByEventDateAsc(LocalDateTime date);
}
