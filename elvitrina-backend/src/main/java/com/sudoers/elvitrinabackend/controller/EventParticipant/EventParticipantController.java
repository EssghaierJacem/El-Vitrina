package com.sudoers.elvitrinabackend.controller.EventParticipant;


import com.sudoers.elvitrinabackend.model.entity.EventParticipant;
import com.sudoers.elvitrinabackend.service.EventParticipant.EventParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class EventParticipantController {

    @Autowired
    private EventParticipantService eventParticipantService;

    @PostMapping
    public ResponseEntity<EventParticipant> createParticipant(@RequestBody EventParticipant participant) {
        EventParticipant savedParticipant = eventParticipantService.saveEventParticipant(participant);
        return ResponseEntity.ok(savedParticipant);
    }

    @GetMapping
    public ResponseEntity<List<EventParticipant>> getAllParticipants() {
        List<EventParticipant> participants = eventParticipantService.getAllEventParticipants();
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventParticipant> getParticipantById(@PathVariable Long id) {
        EventParticipant participant = eventParticipantService.getEventParticipantById(id);
        return ResponseEntity.ok(participant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventParticipant> updateParticipant(@PathVariable Long id, @RequestBody EventParticipant participant) {
        EventParticipant updatedParticipant = eventParticipantService.updateEventParticipant(id, participant);
        return ResponseEntity.ok(updatedParticipant);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable Long id) {
        eventParticipantService.deleteEventParticipant(id);
        return ResponseEntity.noContent().build();
    }


}
