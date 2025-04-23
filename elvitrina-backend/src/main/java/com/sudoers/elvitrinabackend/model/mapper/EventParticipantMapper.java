package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.EventParticipantRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventParticipantResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventParticipant;
import org.springframework.stereotype.Component;

@Component
public class EventParticipantMapper {

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

        return dto;
    }

    public void updateEntityFromDTO(EventParticipantRequestDTO dto, EventParticipant participant) {
    }
}