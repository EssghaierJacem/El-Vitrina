package com.sudoers.elvitrinabackend.controller.EventParticipant;

import com.sudoers.elvitrinabackend.model.dto.request.EventParticipantRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventParticipantResponseDTO;
import com.sudoers.elvitrinabackend.service.EventParticipant.EventParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class EventParticipantController {

    private final EventParticipantService eventParticipantService;

    @Autowired
    public EventParticipantController(EventParticipantService eventParticipantService) {
        this.eventParticipantService = eventParticipantService;
    }

    @PostMapping
    public ResponseEntity<EventParticipantResponseDTO> createParticipant(@RequestBody EventParticipantRequestDTO requestDTO) {
        EventParticipantResponseDTO savedParticipant = eventParticipantService.saveEventParticipant(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedParticipant);
    }

    @GetMapping
    public ResponseEntity<List<EventParticipantResponseDTO>> getAllParticipants() {
        List<EventParticipantResponseDTO> participants = eventParticipantService.getAllEventParticipants();
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventParticipantResponseDTO> getParticipantById(@PathVariable Long id) {
        EventParticipantResponseDTO participant = eventParticipantService.getEventParticipantById(id);
        return ResponseEntity.ok(participant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventParticipantResponseDTO> updateParticipant(@PathVariable Long id, @RequestBody EventParticipantRequestDTO requestDTO) {
        EventParticipantResponseDTO updatedParticipant = eventParticipantService.updateEventParticipant(id, requestDTO);
        return ResponseEntity.ok(updatedParticipant);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable Long id) {
        eventParticipantService.deleteEventParticipant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<EventParticipantResponseDTO>> getParticipantsPaginated(Pageable pageable) {
        Page<EventParticipantResponseDTO> participants = eventParticipantService.getEventParticipantsPaginated(pageable);
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventParticipantResponseDTO>> getParticipantsByEventId(@PathVariable Long eventId) {
        List<EventParticipantResponseDTO> participants = eventParticipantService.getParticipantsByEventId(eventId);
        return ResponseEntity.ok(participants);
    }

    @PostMapping("/register")
    public ResponseEntity<EventParticipantResponseDTO> registerParticipant(

            @RequestBody EventParticipantRequestDTO requestDTO) {

System.out.println(requestDTO);
        return new ResponseEntity<>(eventParticipantService.registerParticipant(requestDTO), HttpStatus.CREATED);
    }

    @PatchMapping("/{participantId}/chat")
    public ResponseEntity<EventParticipantResponseDTO> grantChatAccess(
            @PathVariable Long participantId,
            @RequestParam boolean enable) {
        return ResponseEntity.ok(eventParticipantService.grantChatAccess(participantId, enable));
    }

    @PatchMapping("/{participantId}/recordings")
    public ResponseEntity<EventParticipantResponseDTO> provideRecordingAccess(
            @PathVariable Long participantId,
            @RequestParam boolean enable) {
        return ResponseEntity.ok(eventParticipantService.provideRecordingAccess(participantId, enable));
    }

    @PatchMapping("/{participantId}/attendance")
    public ResponseEntity<EventParticipantResponseDTO> trackSessionAttendance(
            @PathVariable Long participantId,
            @RequestParam boolean attended) {
        return ResponseEntity.ok(eventParticipantService.trackSessionAttendance(participantId, attended));
    }

    @GetMapping("/{participantId}/ticket/validate")
    public ResponseEntity<Boolean> validateParticipantTicket(
            @PathVariable Long participantId) {
        return ResponseEntity.ok(eventParticipantService.validateParticipantTicket(participantId));
    }
}