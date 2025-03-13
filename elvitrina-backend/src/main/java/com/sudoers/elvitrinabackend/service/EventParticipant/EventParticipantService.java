package com.sudoers.elvitrinabackend.service.EventParticipant;
import com.sudoers.elvitrinabackend.model.entity.EventParticipant;

import java.util.List;

public interface EventParticipantService {
    EventParticipant saveEventParticipant(EventParticipant eventParticipant);
    List<EventParticipant> getAllEventParticipants();
    EventParticipant getEventParticipantById(Long id);
    void deleteEventParticipant(Long id);
    EventParticipant updateEventParticipant(Long id, EventParticipant eventParticipant);

}
