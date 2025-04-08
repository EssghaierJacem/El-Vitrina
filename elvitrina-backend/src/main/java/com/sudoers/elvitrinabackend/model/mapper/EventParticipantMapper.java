package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.EventParticipantRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventParticipantResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventParticipant;
import org.springframework.stereotype.Component;

@Component
public class EventParticipantMapper {

    public EventParticipant toEntity(EventParticipantRequestDTO dto) {
        EventParticipant participant = new EventParticipant();
        participant.setAttended(dto.getCheckedIn());
        // userId, eventId, ticketId set in service layer
        return participant;
    }

    public EventParticipantResponseDTO toResponseDTO(EventParticipant participant) {
        EventParticipantResponseDTO dto = new EventParticipantResponseDTO();
        dto.setId(participant.getId());
        dto.setUserId(participant.getUser() != null ? participant.getUser().getId() : null);
        dto.setUserName(participant.getUser() != null ? participant.getUser().getName() : null); // Assuming User has getName()
        dto.setUserEmail(participant.getUser() != null ? participant.getUser().getEmail() : null); // Assuming User has getEmail()
        dto.setEventId(participant.getVirtualEvent() != null ? participant.getVirtualEvent().getEventId() : null);
        dto.setEventTitle(participant.getVirtualEvent() != null ? participant.getVirtualEvent().getTitle() : null);
        dto.setTicketId(null); // Not in entity
        dto.setTicketType(null); // Not in entity
        dto.setCheckedIn(participant.getAttended());
        dto.setRegistrationDate(participant.getTimestamp());
        dto.setCheckInDate(null); // Not in entity
        dto.setRegistrationNotes(null); // Not in entity
        dto.setRegistrationCode(null); // Not in entity
        return dto;
    }

    public void updateEntityFromDTO(EventParticipantRequestDTO dto, EventParticipant participant) {
        if (dto.getCheckedIn() != null) participant.setAttended(dto.getCheckedIn());
        // userId, eventId, ticketId handled in service layer if updated
    }
}