package com.sudoers.elvitrinabackend.service.EventParticipant;

import com.sudoers.elvitrinabackend.model.dto.request.EventParticipantRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventParticipantResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EventParticipantService {
    EventParticipantResponseDTO saveEventParticipant(EventParticipantRequestDTO requestDTO);
    List<EventParticipantResponseDTO> getAllEventParticipants();
    EventParticipantResponseDTO getEventParticipantById(Long id);
    void deleteEventParticipant(Long id);
    EventParticipantResponseDTO updateEventParticipant(Long id, EventParticipantRequestDTO requestDTO);
    Page<EventParticipantResponseDTO> getEventParticipantsPaginated(Pageable pageable);
    List<EventParticipantResponseDTO> getParticipantsByEventId(Long eventId);
}