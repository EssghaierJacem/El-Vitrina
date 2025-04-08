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
    private Long ticketId;
    private Boolean checkedIn;
    private String registrationNotes;
}
