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

    @Autowired
    public VirtualEventMapper(EventTicketMapper eventTicketMapper) {
        this.eventTicketMapper = eventTicketMapper;
    }

    public VirtualEvent toEntity(VirtualEventRequestDTO dto) {
        VirtualEvent event = new VirtualEvent();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getStartDateTime());
        event.setTicketPrice(dto.getTicketPrice());
        event.setStatus(dto.getStatus());
        event.setEventType(dto.getEventType());
        event.setEventMode(dto.getEventMode());
        event.setMaxParticipants(dto.getMaxParticipants());
        event.setStreamUrl(dto.getStreamUrl());
        event.setChatChannelId(dto.getChatChannelId());

        // Map sessions if provided
        if (dto.getSessions() != null && !dto.getSessions().isEmpty()) {
            List<EventSession> sessions = dto.getSessions().stream()
                    .map(sessionDTO -> {
                        EventSession session = new EventSession();
                        session.setStartTime(sessionDTO.getStartTime());
                        session.setEndTime(sessionDTO.getEndTime());
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
        dto.setId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartDateTime(event.getEventDate());
        dto.setTicketPrice(event.getTicketPrice());
        dto.setStatus(event.getStatus());
        dto.setEventType(event.getEventType());
        dto.setEventMode(event.getEventMode());
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
                    return sessionDTO;
                })
                .collect(Collectors.toList()) : Collections.emptyList());

        // Map tickets
        dto.setTickets(event.getTickets() != null ? event.getTickets().stream()
                .map(eventTicketMapper::toResponseDTO)
                .collect(Collectors.toList()) : Collections.emptyList());

        return dto;
    }

    public void updateEntityFromDTO(VirtualEventRequestDTO dto, VirtualEvent event) {
        if (dto.getTitle() != null) event.setTitle(dto.getTitle());
        if (dto.getDescription() != null) event.setDescription(dto.getDescription());
        if (dto.getStartDateTime() != null) event.setEventDate(dto.getStartDateTime());
        if (dto.getTicketPrice() != null) event.setTicketPrice(dto.getTicketPrice());
        if (dto.getStatus() != null) event.setStatus(dto.getStatus());
        if (dto.getEventType() != null) event.setEventType(dto.getEventType());
        if (dto.getEventMode() != null) event.setEventMode(dto.getEventMode());
        if (dto.getMaxParticipants() != null) event.setMaxParticipants(dto.getMaxParticipants());
        if (dto.getStreamUrl() != null) event.setStreamUrl(dto.getStreamUrl());
        if (dto.getChatChannelId() != null) event.setChatChannelId(dto.getChatChannelId());

        // Update sessions if provided
        if (dto.getSessions() != null && !dto.getSessions().isEmpty()) {
            List<EventSession> sessions = dto.getSessions().stream()
                    .map(sessionDTO -> {
                        EventSession session = new EventSession();
                        session.setStartTime(sessionDTO.getStartTime());
                        session.setEndTime(sessionDTO.getEndTime());
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