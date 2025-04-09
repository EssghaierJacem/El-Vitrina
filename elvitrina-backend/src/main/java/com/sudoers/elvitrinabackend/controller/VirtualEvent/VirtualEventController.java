package com.sudoers.elvitrinabackend.controller.VirtualEvent;

import com.sudoers.elvitrinabackend.model.dto.request.VirtualEventRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.VirtualEventResponseDTO;
import com.sudoers.elvitrinabackend.model.enums.EventMode;
import com.sudoers.elvitrinabackend.model.enums.EventType;
import com.sudoers.elvitrinabackend.service.VirtualEvent.VirtualEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
    @Operation(summary = "Create a new virtual event", description = "Creates a virtual event with the provided details.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Event created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<VirtualEventResponseDTO> createEvent(@Valid @RequestBody VirtualEventRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(virtualEventService.createEvent(requestDTO));
    }

    @GetMapping
    @Operation(summary = "Get all virtual events", description = "Retrieves a list of all virtual events.")
    public ResponseEntity<List<VirtualEventResponseDTO>> getAllEvents() {
        return ResponseEntity.ok(virtualEventService.getAllEvents());
    }

    @GetMapping(params = {"page", "size"})
    @Operation(summary = "Get paginated virtual events", description = "Retrieves virtual events with pagination.")
    public ResponseEntity<Page<VirtualEventResponseDTO>> getEventsPaginated(Pageable pageable) {
        return ResponseEntity.ok(virtualEventService.getEventsPaginated(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID", description = "Retrieves a specific virtual event by its ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Event found"),
            @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<VirtualEventResponseDTO> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(virtualEventService.getEventById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an event", description = "Updates an existing virtual event.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Event updated successfully"),
            @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<VirtualEventResponseDTO> updateEvent(@PathVariable Long id, @Valid @RequestBody VirtualEventRequestDTO requestDTO) {
        return ResponseEntity.ok(virtualEventService.updateEvent(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an event", description = "Deletes a virtual event by its ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Event deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        virtualEventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming events", description = "Retrieves a list of upcoming events with an optional limit.")
    public ResponseEntity<List<VirtualEventResponseDTO>> getUpcomingEvents(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(virtualEventService.getUpcomingEvents(limit));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter events by type and mode", description = "Filters events by event type and mode.")
    public ResponseEntity<List<VirtualEventResponseDTO>> filterEvents(
            @RequestParam(required = false) EventType eventType,
            @RequestParam(required = false) EventMode eventMode) {
        return ResponseEntity.ok(virtualEventService.filterEventsByTypeAndMode(eventType, eventMode));
    }

    @GetMapping("/search")
    @Operation(summary = "Search events", description = "Searches events by keyword in title or description.")
    public ResponseEntity<List<VirtualEventResponseDTO>> searchEvents(@RequestParam String keyword) {
        return ResponseEntity.ok(virtualEventService.searchEvents(keyword));
    }

    @GetMapping("/calendar")
    @Operation(summary = "Get upcoming events calendar", description = "Retrieves upcoming events for a calendar view.")
    public ResponseEntity<List<VirtualEventResponseDTO>> getUpcomingEventsCalendar() {
        return ResponseEntity.ok(virtualEventService.getUpcomingEventsCalendar());
    }

    @GetMapping("/{id}/capacity")
    @Operation(summary = "Check event capacity", description = "Checks if the event has available capacity.")
    public ResponseEntity<Boolean> checkEventCapacity(@PathVariable Long id) {
        return ResponseEntity.ok(virtualEventService.checkEventCapacity(id));
    }

    @PatchMapping("/{id}/stream/start")
    @Operation(summary = "Start live stream", description = "Starts the live stream for an event.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stream started"),
            @ApiResponse(responseCode = "400", description = "Invalid state for streaming")
    })
    public ResponseEntity<VirtualEventResponseDTO> startLiveStream(
            @PathVariable Long id, @RequestBody String streamUrl) {
        return ResponseEntity.ok(virtualEventService.startLiveStream(id, streamUrl));
    }

    @PatchMapping("/{id}/stream/stop")
    @Operation(summary = "Stop live stream", description = "Stops the live stream for an event.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stream stopped"),
            @ApiResponse(responseCode = "400", description = "Invalid state for stopping stream")
    })
    public ResponseEntity<VirtualEventResponseDTO> stopLiveStream(@PathVariable Long id) {
        return ResponseEntity.ok(virtualEventService.stopLiveStream(id));
    }

    @PatchMapping("/{id}/chat")
    @Operation(summary = "Toggle chat", description = "Enables or disables chat for an event.")
    public ResponseEntity<VirtualEventResponseDTO> toggleChat(
            @PathVariable Long id, @RequestParam boolean enable) {
        return ResponseEntity.ok(virtualEventService.toggleChat(id, enable));
    }

    @GetMapping("/{id}/schedule")
    @Operation(summary = "Get event session schedule", description = "Retrieves the session schedule for an event.")
    public ResponseEntity<VirtualEventResponseDTO> getEventSessionSchedule(@PathVariable Long id) {
        return ResponseEntity.ok(virtualEventService.getEventSessionSchedule(id));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update event status", description = "Updates the status of an event.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status updated"),
            @ApiResponse(responseCode = "400", description = "Invalid status transition")
    })
    public ResponseEntity<VirtualEventResponseDTO> updateEventStatus(
            @PathVariable Long id, @RequestBody String status) {
        return ResponseEntity.ok(virtualEventService.updateEventStatus(id, status));
    }
}