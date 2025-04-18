package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventParticipantResponseDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long eventId;
    private String eventTitle;
    private Long ticketId;
    private String ticketType;
    private Boolean attended; // Renamed from checkedIn for clarity
    private LocalDateTime registrationDate;
    private Boolean hasAccessToChat;
    private Boolean hasAccessToRecordings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}