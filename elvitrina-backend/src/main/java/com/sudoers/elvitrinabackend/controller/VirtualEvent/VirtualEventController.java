package com.sudoers.elvitrinabackend.controller.VirtualEvent;

import com.sudoers.elvitrinabackend.model.dto.request.VirtualEventRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.VirtualEventResponseDTO;
import com.sudoers.elvitrinabackend.service.VirtualEvent.VirtualEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class VirtualEventController {

    private final VirtualEventService virtualEventService;

    @Autowired
    public VirtualEventController(VirtualEventService virtualEventService) {
        this.virtualEventService = virtualEventService;
    }

    @PostMapping
    public ResponseEntity<VirtualEventResponseDTO> createEvent(@RequestBody VirtualEventRequestDTO requestDTO) {
        VirtualEventResponseDTO savedEvent = virtualEventService.createEvent(requestDTO);
        return ResponseEntity.ok(savedEvent);
    }

    @GetMapping
    public ResponseEntity<List<VirtualEventResponseDTO>> getAllEvents() {
        List<VirtualEventResponseDTO> events = virtualEventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<VirtualEventResponseDTO>> getEventsPaginated(Pageable pageable) {
        Page<VirtualEventResponseDTO> events = virtualEventService.getEventsPaginated(pageable);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VirtualEventResponseDTO> getEventById(@PathVariable Long id) {
        VirtualEventResponseDTO event = virtualEventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VirtualEventResponseDTO> updateEvent(@PathVariable Long id, @RequestBody VirtualEventRequestDTO requestDTO) {
        VirtualEventResponseDTO updatedEvent = virtualEventService.updateEvent(id, requestDTO);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        virtualEventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VirtualEventResponseDTO> changeEventStatus(@PathVariable Long id, @RequestParam String status) {
        VirtualEventResponseDTO updatedEvent = virtualEventService.changeEventStatus(id, status);
        return ResponseEntity.ok(updatedEvent);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<VirtualEventResponseDTO>> getUpcomingEvents(@RequestParam(defaultValue = "5") int limit) {
        List<VirtualEventResponseDTO> upcomingEvents = virtualEventService.getUpcomingEvents(limit);
        return ResponseEntity.ok(upcomingEvents);
    }
}
