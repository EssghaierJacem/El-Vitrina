package com.sudoers.elvitrinabackend.controller.VirtualEvent;

import com.sudoers.elvitrinabackend.model.dto.request.EventSessionRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventSessionResponseDTO;
import com.sudoers.elvitrinabackend.service.EventSession.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class EventSessionController {

    private final EventSessionService eventSessionService;

    @Autowired
    public EventSessionController(EventSessionService eventSessionService) {
        this.eventSessionService = eventSessionService;
    }

    @PostMapping
    public ResponseEntity<EventSessionResponseDTO> addSessionToEvent(
            @RequestBody EventSessionRequestDTO requestDTO) {
        System.out.println(requestDTO);
        return new ResponseEntity<>(eventSessionService.addSessionToEvent(requestDTO), HttpStatus.CREATED);
    }

    @GetMapping("/availability/{eventId}")
    public ResponseEntity<List<EventSessionResponseDTO>> getSessionAvailability(
            @PathVariable Long eventId) {
        return ResponseEntity.ok(eventSessionService.getSessionAvailability(eventId));
    }

    @PatchMapping("/{sessionId}/complete")
    public ResponseEntity<EventSessionResponseDTO> markSessionAsCompleted(
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(eventSessionService.markSessionAsCompleted(sessionId));
    }


    @DeleteMapping("/{eventId}/sessions")
    public ResponseEntity<Void> removeSessionByEventIdAndTitle(
            @PathVariable Long eventId,
            @RequestParam String title) {
        eventSessionService.removeSessionByEventIdAndTitle(eventId, title);
        return ResponseEntity.noContent().build();
    }




}