package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.EventTicketRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventTicketResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventTicket;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class EventTicketMapper {

    public EventTicket toEntity(EventTicketRequestDTO dto) {
        EventTicket ticket = new EventTicket();
        ticket.setType(dto.getTicketType());
        ticket.setDescription(dto.getDescription());
        ticket.setPrice(dto.getPrice() != null ? dto.getPrice().doubleValue() : null);
        ticket.setQuantityAvailable(dto.getQuantity());
        ticket.setQuantityRemaining(dto.getQuantity());
        ticket.setEarlyBirdPricing(dto.getEarlyBirdPricing() != null ? dto.getEarlyBirdPricing().doubleValue() : null);
        return ticket;
    }

    public EventTicketResponseDTO toResponseDTO(EventTicket ticket) {
        EventTicketResponseDTO dto = new EventTicketResponseDTO();
        dto.setTicketId(ticket.getTicketId());
        dto.setDescription(ticket.getDescription());
        dto.setPrice(ticket.getPrice() != null ? BigDecimal.valueOf(ticket.getPrice()) : null);
        dto.setIsValid(ticket.getIsValid());
        dto.setQrCodeHash(ticket.getQrCodeHash());
        dto.setValidUntil(ticket.getValidUntil());
        return dto;
    }

    public void updateEntityFromDTO(EventTicketRequestDTO dto, EventTicket ticket) {
        if (dto.getTicketType() != null) ticket.setType(dto.getTicketType());
        if (dto.getDescription() != null) ticket.setDescription(dto.getDescription());
        if (dto.getPrice() != null) ticket.setPrice(dto.getPrice().doubleValue());
        if (dto.getQuantity() != null) {
            ticket.setQuantityAvailable(dto.getQuantity());
            // Quantity remaining adjusted in service, not here
        }
        if (dto.getEarlyBirdPricing() != null) ticket.setEarlyBirdPricing(dto.getEarlyBirdPricing().doubleValue());
    }
}