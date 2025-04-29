package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.EventSessionRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.VirtualEventRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventSessionResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventTicketResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.VirtualEventResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventSession;
import com.sudoers.elvitrinabackend.model.entity.EventTicket;
import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class VirtualEventMapper {

    private final EventTicketMapper eventTicketMapper;
    private final EventParticipantMapper eventParticipantMapper;

    @Autowired
    public VirtualEventMapper(EventTicketMapper eventTicketMapper ,EventParticipantMapper eventParticipantMapper ) {
        this.eventTicketMapper = eventTicketMapper;
        this.eventParticipantMapper = eventParticipantMapper;
    }

    public VirtualEvent toEntity(VirtualEventRequestDTO dto ,  String imagePath) {
        VirtualEvent event = new VirtualEvent();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getStartDateTime());
        event.setTicketPrice(dto.getTicketPrice());
        event.setEventType(dto.getEventType());
        event.setEventMode(dto.getEventMode());
        event.setEventImage(imagePath);
        event.setMaxParticipants(dto.getMaxParticipants());

        // Map sessions if provided
        if (dto.getSessions() != null && !dto.getSessions().isEmpty()) {
            List<EventSession> sessions = dto.getSessions().stream()
                    .map(sessionDTO -> {
                        EventSession session = new EventSession();
                        session.setStartTime(sessionDTO.getStartTime().toLocalDateTime());
                        session.setEndTime(sessionDTO.getEndTime().toLocalDateTime());
                        session.setSessionTitle(sessionDTO.getSessionTitle());
                        session.setVirtualEvent(event); // Bidirectional relationship
                        return session;
                    })
                    .collect(Collectors.toList());
            event.setSessions(sessions);
        }

        // Store and User relationships set in service layer using storeId and userId
        return event;
    }

    public VirtualEventResponseDTO toResponseDTO(VirtualEvent event) {
        VirtualEventResponseDTO dto = new VirtualEventResponseDTO();
        dto.setEventId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartDateTime(event.getEventDate());
        dto.setTicketPrice(event.getTicketPrice());
        dto.setStatus(event.getStatus());
        dto.setEventType(event.getEventType());
        dto.setEventMode(event.getEventMode());
        dto.setEventImage(event.getEventImage());
        dto.setMaxParticipants(event.getMaxParticipants());
        dto.setParticipantCount(event.getParticipants() != null ? event.getParticipants().size() : 0);
        dto.setStreamUrl(event.getStreamUrl());
        dto.setChatChannelId(event.getChatChannelId());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());

        // Map sessions
        dto.setSessions(event.getSessions() != null ? event.getSessions().stream()
                .map(session -> {
                    EventSessionResponseDTO sessionDTO = new EventSessionResponseDTO();
                    sessionDTO.setSessionId(session.getSessionId());
                    sessionDTO.setStartTime(session.getStartTime());
                    sessionDTO.setEndTime(session.getEndTime());
                    sessionDTO.setSessionTitle(session.getSessionTitle());
                    sessionDTO.setStreamUrl(session.getStreamUrl());
                    return sessionDTO;
                })
                .collect(Collectors.toList()) : Collections.emptyList());

        // Map tickets
        dto.setTickets(event.getTickets() != null ? event.getTickets().stream()
                .map(eventTicketMapper::toResponseDTO)
                .collect(Collectors.toList()) : Collections.emptyList());

        // Map par
        dto.setParticipants(event.getParticipants() != null ? event.getParticipants().stream()
                .map(eventParticipantMapper::toResponseDTO)
                .collect(Collectors.toList()) : Collections.emptyList());
        return dto;
    }

    public void updateEntityFromDTO(VirtualEventRequestDTO dto, VirtualEvent event) {
        if (dto.getTitle() != null) event.setTitle(dto.getTitle());
        if (dto.getDescription() != null) event.setDescription(dto.getDescription());
        if (dto.getStartDateTime() != null) event.setEventDate(dto.getStartDateTime());
        if (dto.getTicketPrice() != null) event.setTicketPrice(dto.getTicketPrice());
        if (dto.getEventType() != null) event.setEventType(dto.getEventType());
        if (dto.getEventMode() != null) event.setEventMode(dto.getEventMode());
        if (dto.getMaxParticipants() != null) event.setMaxParticipants(dto.getMaxParticipants());

        // Update sessions if provided
        if (dto.getSessions() != null && !dto.getSessions().isEmpty()) {
            List<EventSession> sessions = dto.getSessions().stream()
                    .map(sessionDTO -> {
                        EventSession session = new EventSession();
                        session.setStartTime(sessionDTO.getStartTime().toLocalDateTime());
                        session.setEndTime(sessionDTO.getEndTime().toLocalDateTime());
                        session.setSessionTitle(sessionDTO.getSessionTitle());
                        session.setVirtualEvent(event);
                        return session;
                    })
                    .collect(Collectors.toList());
            event.setSessions(sessions);
        }

        // Store and User relationships updated in service layer if needed
    }
}