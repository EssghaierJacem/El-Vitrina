package com.sudoers.elvitrinabackend.service.EventTicket;

import com.sudoers.elvitrinabackend.model.dto.request.EventTicketRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventTicketResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EventTicketService {
    EventTicketResponseDTO saveEventTicket(EventTicketRequestDTO requestDTO);
    List<EventTicketResponseDTO> getAllEventTickets();
    EventTicketResponseDTO getEventTicketById(Long id);
    void deleteEventTicket(Long id);
    EventTicketResponseDTO updateEventTicket(Long id, EventTicketRequestDTO requestDTO);
    Page<EventTicketResponseDTO> getEventTicketsPaginated(Pageable pageable);
    List<EventTicketResponseDTO> getTicketsByEventId(Long eventId);

    EventTicketResponseDTO generateQRCodeForTicket(Long ticketId);
    boolean validateTicket(Long ticketId);
//    List<EventTicketResponseDTO> issueMultiSessionTickets(EventTicketRequestDTO requestDTO, int quantity);
    EventTicketResponseDTO applyEarlyBirdPricing(Long ticketId);
    EventTicketResponseDTO trackTicketAvailability(Long ticketId);
    EventTicketResponseDTO cancelTicket(Long ticketId);
    public List<EventTicket> getTicketsWithSeats(Long userId, Long eventId);
}