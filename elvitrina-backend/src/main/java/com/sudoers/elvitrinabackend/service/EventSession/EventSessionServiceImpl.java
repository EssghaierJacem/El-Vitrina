package com.sudoers.elvitrinabackend.service.EventSession;


import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.request.EventSessionRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventSessionResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventSession;
import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import com.sudoers.elvitrinabackend.repository.EventSessionRepository;
import com.sudoers.elvitrinabackend.repository.VirtualEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventSessionServiceImpl implements EventSessionService {

    private final EventSessionRepository eventSessionRepository;
    private final VirtualEventRepository virtualEventRepository;

    @Autowired
    public EventSessionServiceImpl(EventSessionRepository eventSessionRepository,
                                   VirtualEventRepository virtualEventRepository) {
        this.eventSessionRepository = eventSessionRepository;
        this.virtualEventRepository = virtualEventRepository;
    }


    @Override
    public EventSessionResponseDTO addSessionToEvent(EventSessionRequestDTO requestDTO) {
        VirtualEvent virtualEvent = virtualEventRepository.findById(requestDTO.getVirtualEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Virtual event not found with id: " + requestDTO.getVirtualEventId()));

        EventSession session = new EventSession();
        session.setStartTime(requestDTO.getStartTime().toLocalDateTime()); // Convert OffsetDateTime to LocalDateTime
        session.setEndTime(requestDTO.getEndTime().toLocalDateTime());
        session.setSessionTitle(requestDTO.getSessionTitle());
        session.setVirtualEvent(virtualEvent);
session.setStreamUrl(requestDTO.getStreamUrl());
        EventSession savedSession = eventSessionRepository.save(session);
        return mapToResponseDTO(savedSession);
    }

    @Override
    public List<EventSessionResponseDTO> getSessionAvailability(Long eventId) {
        virtualEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Virtual event not found with id: " + eventId));

        LocalDateTime now = LocalDateTime.now();
        return eventSessionRepository.findByVirtualEventEventId(eventId).stream()
                .filter(session -> session.getStartTime().isAfter(now))
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventSessionResponseDTO markSessionAsCompleted(Long sessionId) {
        EventSession session = eventSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));

        LocalDateTime now = LocalDateTime.now();
        if (session.getEndTime().isBefore(now)) {
            session.setUpdatedAt(now);
            return mapToResponseDTO(eventSessionRepository.save(session));
        } else {
            throw new IllegalStateException("Session has not yet ended");
        }
    }

    private EventSessionResponseDTO mapToResponseDTO(EventSession session) {
        EventSessionResponseDTO dto = new EventSessionResponseDTO();
        dto.setSessionId(session.getSessionId());
        dto.setStartTime(session.getStartTime());
        dto.setEndTime(session.getEndTime());
        dto.setSessionTitle(session.getSessionTitle());
        dto.setVirtualEventId(session.getVirtualEvent().getEventId());
        dto.setStreamUrl(session.getStreamUrl());
        return dto;
    }
}