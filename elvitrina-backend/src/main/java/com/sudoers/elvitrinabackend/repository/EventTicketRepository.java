package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.EventTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventTicketRepository extends JpaRepository<EventTicket, Long> {
    List<EventTicket> findByVirtualEventEventId(Long eventId);
    void deleteByVirtualEventEventId(Long eventId);

    @Query("SELECT t FROM EventTicket t " +
            "LEFT JOIN FETCH t.seats s " +
            "WHERE t.eventParticipant.id = :userId " +
            "AND t.virtualEvent.eventId = :eventId")
    List<EventTicket> findTicketsWithSeats(@Param("userId") Long userId,
                                           @Param("eventId") Long eventId);
}