package com.sudoers.elvitrinabackend.controller.EventTicket;


import com.sudoers.elvitrinabackend.model.entity.EventTicket;
import com.sudoers.elvitrinabackend.service.EventTicket.EventTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class EventTicketController {

    @Autowired
    private EventTicketService eventTicketService;

    @PostMapping
    public ResponseEntity<EventTicket> createTicket(@RequestBody EventTicket ticket) {
        EventTicket savedTicket = eventTicketService.saveEventTicket(ticket);
        return ResponseEntity.ok(savedTicket);
    }
    @GetMapping
    public ResponseEntity<List<EventTicket>> getAllTickets() {
        List<EventTicket> tickets = eventTicketService.getAllEventTickets();
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventTicket> getTicketById(@PathVariable Long id) {
        EventTicket ticket = eventTicketService.getEventTicketById(id);
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventTicket> updateTicket(@PathVariable Long id, @RequestBody EventTicket ticket) {
        EventTicket updatedTicket = eventTicketService.updateEventTicket(id, ticket);
        return ResponseEntity.ok(updatedTicket);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        eventTicketService.deleteEventTicket(id);
        return ResponseEntity.noContent().build();
    }


}
