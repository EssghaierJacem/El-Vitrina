package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.EventParticipantRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventParticipantResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventParticipant;
import org.springframework.stereotype.Component;

@Component
public class EventParticipantMapper {

    public EventParticipant toEntity(EventParticipantRequestDTO dto) {
        EventParticipant participant = new EventParticipant();
        participant.setAttended(dto.getCheckedIn() != null ? dto.getCheckedIn() : false);
        participant.setHasAccessToChat(dto.getHasAccessToChat() != null ? dto.getHasAccessToChat() : false);
        participant.setHasAccessToRecordings(dto.getHasAccessToRecordings() != null ? dto.getHasAccessToRecordings() : false);
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
        dto.setTicketId(participant.getEventTicket() != null ? participant.getEventTicket().getTicketId() : null);
        dto.setTicketType(participant.getEventTicket() != null ? participant.getEventTicket().getType() : null);
        dto.setAttended(participant.getAttended());
        dto.setRegistrationDate(participant.getRegistrationDate());
        dto.setHasAccessToChat(participant.getHasAccessToChat());
        dto.setHasAccessToRecordings(participant.getHasAccessToRecordings());
        dto.setCreatedAt(participant.getCreatedAt());
        dto.setUpdatedAt(participant.getUpdatedAt());
        return dto;
    }

    public void updateEntityFromDTO(EventParticipantRequestDTO dto, EventParticipant participant) {
        if (dto.getCheckedIn() != null) participant.setAttended(dto.getCheckedIn());
        if (dto.getHasAccessToChat() != null) participant.setHasAccessToChat(dto.getHasAccessToChat());
        if (dto.getHasAccessToRecordings() != null) participant.setHasAccessToRecordings(dto.getHasAccessToRecordings());
    }
}