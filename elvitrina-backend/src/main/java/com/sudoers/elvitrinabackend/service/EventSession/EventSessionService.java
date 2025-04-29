package com.sudoers.elvitrinabackend.service.EventSession;


import com.sudoers.elvitrinabackend.model.dto.request.EventSessionRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventSessionResponseDTO;

import java.util.List;

public interface EventSessionService {
    EventSessionResponseDTO addSessionToEvent(EventSessionRequestDTO requestDTO);
    List<EventSessionResponseDTO> getSessionAvailability(Long eventId);
    EventSessionResponseDTO markSessionAsCompleted(Long sessionId);

    void removeSessionByEventIdAndTitle(Long eventId, String title);

}