package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.EventParticipantRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventParticipantResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventParticipant;
import com.sudoers.elvitrinabackend.model.entity.Seats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class EventParticipantMapper {
    private final EventTicketMapper eventTicketMapper;

    @Autowired
    public EventParticipantMapper(EventTicketMapper eventTicketMapper  ) {
        this.eventTicketMapper = eventTicketMapper;
    }

    public EventParticipant toEntity(EventParticipantRequestDTO dto) {
        EventParticipant participant = new EventParticipant();

        // userId, eventId, ticketId set in service layer
        return participant;
    }

    public EventParticipantResponseDTO toResponseDTO(EventParticipant participant) {
        EventParticipantResponseDTO dto = new EventParticipantResponseDTO();
        dto.setId(participant.getId());
        dto.setUserId(participant.getUser() != null ? participant.getUser().getId() : null);
        dto.setUserName(participant.getUser() != null ? participant.getUser().getName() : null);
        dto.setUserEmail(participant.getUser() != null ? participant.getUser().getEmail() : null);
        dto.setUserImage(participant.getUser() != null ? participant.getUser().getImage() : null);
        if (participant.getEventTicket() != null) {
            dto.setTicketId(participant.getEventTicket().getTicketId());
            dto.setEventTicket(eventTicketMapper.toResponseDTO(participant.getEventTicket())); // Corrected this line
            dto.setSeats(participant.getEventTicket().getSeats() != null ? participant.getEventTicket().getSeats().stream()
                    .map(seats -> {
                        Seats seat = new Seats();
                        seat.setId(seats.getId());
                        seat.setSeatId(seats.getSeatId());
                        return seat;
                    })
                    .collect(Collectors.toList()) : Collections.emptyList());
        }

        return dto;
    }

    public void updateEntityFromDTO(EventParticipantRequestDTO dto, EventParticipant participant) {
    }
}