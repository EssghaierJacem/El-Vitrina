package com.sudoers.elvitrinabackend.service.EventTicket;


import com.sudoers.elvitrinabackend.model.entity.EventTicket;
import com.sudoers.elvitrinabackend.repository.EventTicketRepository;
import com.sudoers.elvitrinabackend.service.EventTicket.EventTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventTicketServiceImpl implements EventTicketService {

    @Autowired
    private EventTicketRepository eventTicketRepository;

    @Override
    public EventTicket saveEventTicket(EventTicket eventTicket) {
        return eventTicketRepository.save(eventTicket);
    }

    @Override
    public List<EventTicket> getAllEventTickets() {
        return eventTicketRepository.findAll();
    }

    @Override
    public EventTicket getEventTicketById(Long id) {
        Optional<EventTicket> eventTicket = eventTicketRepository.findById(id);
        return eventTicket.orElseThrow(() -> new RuntimeException("EventTicket not found"));
    }

    @Override
    public void deleteEventTicket(Long id) {
        eventTicketRepository.deleteById(id);
    }

    @Override
    public EventTicket updateEventTicket(Long id, EventTicket eventTicket) {
        EventTicket existingTicket = getEventTicketById(id);
        existingTicket.setName(eventTicket.getName());
        existingTicket.setDescription(eventTicket.getDescription());
        existingTicket.setPrice(eventTicket.getPrice());
        existingTicket.setQuantityAvailable(eventTicket.getQuantityAvailable());
        existingTicket.setQuantityRemaining(eventTicket.getQuantityRemaining());
        existingTicket.setEarlyBirdPricing(eventTicket.getEarlyBirdPricing());
        existingTicket.setType(eventTicket.getType());
        existingTicket.setTimestamp(eventTicket.getTimestamp());
        existingTicket.setVirtualEvent(eventTicket.getVirtualEvent());
        return eventTicketRepository.save(existingTicket);
    }


}