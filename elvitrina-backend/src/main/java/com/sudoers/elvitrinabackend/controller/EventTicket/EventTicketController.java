package com.sudoers.elvitrinabackend.controller.EventTicket;

import com.sudoers.elvitrinabackend.model.dto.request.EventTicketRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventTicketResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventTicket;
import com.sudoers.elvitrinabackend.service.EventTicket.EventTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class EventTicketController {

    private final EventTicketService eventTicketService;

    @Autowired
    public EventTicketController(EventTicketService eventTicketService) {
        this.eventTicketService = eventTicketService;
    }

    @PostMapping
    public ResponseEntity<EventTicketResponseDTO> createTicket(@RequestBody EventTicketRequestDTO requestDTO) {
        EventTicketResponseDTO savedTicket = eventTicketService.saveEventTicket(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTicket);
    }

    @GetMapping
    public ResponseEntity<List<EventTicketResponseDTO>> getAllTickets() {
        List<EventTicketResponseDTO> tickets = eventTicketService.getAllEventTickets();
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventTicketResponseDTO> getTicketById(@PathVariable Long id) {
        EventTicketResponseDTO ticket = eventTicketService.getEventTicketById(id);
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventTicketResponseDTO> updateTicket(@PathVariable Long id, @RequestBody EventTicketRequestDTO requestDTO) {
        EventTicketResponseDTO updatedTicket = eventTicketService.updateEventTicket(id, requestDTO);
        return ResponseEntity.ok(updatedTicket);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        eventTicketService.deleteEventTicket(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<EventTicketResponseDTO>> getTicketsPaginated(Pageable pageable) {
        Page<EventTicketResponseDTO> tickets = eventTicketService.getEventTicketsPaginated(pageable);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventTicketResponseDTO>> getTicketsByEventId(@PathVariable Long eventId) {
        List<EventTicketResponseDTO> tickets = eventTicketService.getTicketsByEventId(eventId);
        System.out.println(tickets.isEmpty());
        return ResponseEntity.ok(tickets);
    }
    @GetMapping("/with-seats")
    public ResponseEntity<List<EventTicket>> getTicketsWithSeats(
            @RequestParam Long userId,
            @RequestParam Long eventId) {
        List<EventTicket> ticketsWithSeats = eventTicketService.getTicketsWithSeats(userId, eventId);
        System.out.println(ticketsWithSeats.isEmpty());
        return ResponseEntity.ok(ticketsWithSeats);
    }
    @PostMapping("/{ticketId}/qrcode")
    public ResponseEntity<EventTicketResponseDTO> generateQRCodeForTicket(
            @PathVariable Long ticketId) {
        return ResponseEntity.ok(eventTicketService.generateQRCodeForTicket(ticketId));
    }

    @GetMapping("/{ticketId}/validate")
    public ResponseEntity<Boolean> validateTicket(
            @PathVariable Long ticketId) {
        return ResponseEntity.ok(eventTicketService.validateTicket(ticketId));
    }

 /*   @PostMapping("/multi-session")
    public ResponseEntity<List<EventTicketResponseDTO>> issueMultiSessionTickets(
            @RequestBody EventTicketRequestDTO requestDTO,
            @RequestParam(defaultValue = "1") int quantity) {
        return new ResponseEntity<>(eventTicketService.issueMultiSessionTickets(requestDTO, quantity), HttpStatus.CREATED);
    }*/

    @PatchMapping("/{ticketId}/early-bird")
    public ResponseEntity<EventTicketResponseDTO> applyEarlyBirdPricing(
            @PathVariable Long ticketId) {
        return ResponseEntity.ok(eventTicketService.applyEarlyBirdPricing(ticketId));
    }

    @GetMapping("/{ticketId}/availability")
    public ResponseEntity<EventTicketResponseDTO> trackTicketAvailability(
            @PathVariable Long ticketId) {
        return ResponseEntity.ok(eventTicketService.trackTicketAvailability(ticketId));
    }

    @PatchMapping("/{ticketId}/cancel")
    public ResponseEntity<EventTicketResponseDTO> cancelTicket(
            @PathVariable Long ticketId) {
        return ResponseEntity.ok(eventTicketService.cancelTicket(ticketId));
    }
}