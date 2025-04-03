package com.sudoers.elvitrinabackend.controller.VirtualEvent;

import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import com.sudoers.elvitrinabackend.service.VirtualEvent.VirtualEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class VirtualEventController {

    @Autowired
    private VirtualEventService virtualEventService;

    @PostMapping
    public ResponseEntity<VirtualEvent> createEvent(@RequestBody VirtualEvent virtualEvent) {
        VirtualEvent savedEvent = virtualEventService.saveVirtualEvent(virtualEvent);
        return ResponseEntity.ok(savedEvent);
    }

    @GetMapping
    public ResponseEntity<List<VirtualEvent>> getAllEvents() {
        List<VirtualEvent> events = virtualEventService.getAllVirtualEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VirtualEvent> getEventById(@PathVariable Long id) {
        VirtualEvent event = virtualEventService.getVirtualEventById(id);
        return ResponseEntity.ok(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VirtualEvent> updateEvent(@PathVariable Long id, @RequestBody VirtualEvent virtualEvent) {
        VirtualEvent updatedEvent = virtualEventService.updateVirtualEvent(id, virtualEvent);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        virtualEventService.deleteVirtualEvent(id);
        return ResponseEntity.noContent().build();
    }


}