package com.sudoers.elvitrinabackend.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventParticipantRequestDTO {
    private Long userId;
    private Long eventId;
    private Long ticketId; // For ticket validation
    private Boolean checkedIn; // Maps to attended
    private String registrationNotes; // Optional for registration
    private Boolean hasAccessToChat; // For chat access
    private Boolean hasAccessToRecordings; // For recording access
}