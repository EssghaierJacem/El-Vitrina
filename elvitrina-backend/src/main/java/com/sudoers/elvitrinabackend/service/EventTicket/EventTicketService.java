package com.sudoers.elvitrinabackend.service.EventTicket;

import com.sudoers.elvitrinabackend.model.entity.EventTicket;

import java.util.List;

public interface EventTicketService {
    EventTicket saveEventTicket(EventTicket eventTicket);
    List<EventTicket> getAllEventTickets();
    EventTicket getEventTicketById(Long id);
    void deleteEventTicket(Long id);
    EventTicket updateEventTicket(Long id, EventTicket eventTicket);
}