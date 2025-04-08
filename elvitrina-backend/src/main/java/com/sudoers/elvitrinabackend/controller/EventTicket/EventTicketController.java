package com.sudoers.elvitrinabackend.controller.EventTicket;

import com.sudoers.elvitrinabackend.model.dto.request.EventTicketRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventTicketResponseDTO;
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
        return ResponseEntity.ok(tickets);
    }
}