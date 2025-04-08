package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.EventTicketRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.VirtualEventRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventTicketResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.VirtualEventResponseDTO;
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
        event.setEventType(dto.getEventType());
        event.setStatus(dto.getStatus());
        return event;
    }

    public VirtualEventResponseDTO toResponseDTO(VirtualEvent event) {
        VirtualEventResponseDTO dto = new VirtualEventResponseDTO();
        dto.setId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartDateTime(event.getEventDate());
        dto.setEndDateTime(null); // Not in entity, set in service if needed
        dto.setEventType(event.getEventType());
        dto.setEventUrl(null); // Not in entity
        dto.setStatus(event.getStatus());
        dto.setCreatedAt(event.getTimestamp());
        dto.setUpdatedAt(null); // Not in entity
        List<EventTicket> tickets = event.getTickets() != null ? event.getTickets() : Collections.emptyList();
        dto.setTickets(tickets.stream()
                .map(eventTicketMapper::toResponseDTO)
                .collect(Collectors.toList()));
        dto.setParticipantCount(event.getParticipants() != null ? event.getParticipants().size() : 0);
        return dto;
    }

    public void updateEntityFromDTO(VirtualEventRequestDTO dto, VirtualEvent event) {
        if (dto.getTitle() != null) event.setTitle(dto.getTitle());
        if (dto.getDescription() != null) event.setDescription(dto.getDescription());
        if (dto.getStartDateTime() != null) event.setEventDate(dto.getStartDateTime());
        if (dto.getEventType() != null) event.setEventType(dto.getEventType());
        if (dto.getStatus() != null) event.setStatus(dto.getStatus());
        // Tickets handled separately in service if needed
    }
}