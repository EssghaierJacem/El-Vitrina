package com.sudoers.elvitrinabackend.service.EventParticipant;


import com.sudoers.elvitrinabackend.model.entity.EventParticipant;
import com.sudoers.elvitrinabackend.repository.EventParticipantRepository;
import com.sudoers.elvitrinabackend.service.EventParticipant.EventParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventParticipantServiceImpl implements EventParticipantService {

    @Autowired
    private EventParticipantRepository eventParticipantRepository;

    @Override
    public EventParticipant saveEventParticipant(EventParticipant eventParticipant) {
        return eventParticipantRepository.save(eventParticipant);
    }

    @Override
    public List<EventParticipant> getAllEventParticipants() {
        return eventParticipantRepository.findAll();
    }

    @Override
    public EventParticipant getEventParticipantById(Long id) {
        Optional<EventParticipant> eventParticipant = eventParticipantRepository.findById(id);
        return eventParticipant.orElseThrow(() -> new RuntimeException("EventParticipant not found"));
    }

    @Override
    public void deleteEventParticipant(Long id) {
        eventParticipantRepository.deleteById(id);
    }

    @Override
    public EventParticipant updateEventParticipant(Long id, EventParticipant eventParticipant) {
        EventParticipant existingParticipant = getEventParticipantById(id);
        existingParticipant.setAttended(eventParticipant.getAttended());
        existingParticipant.setTimestamp(eventParticipant.getTimestamp());
        existingParticipant.setUser(eventParticipant.getUser());
        existingParticipant.setVirtualEvent(eventParticipant.getVirtualEvent());
        return eventParticipantRepository.save(existingParticipant);
    }


}