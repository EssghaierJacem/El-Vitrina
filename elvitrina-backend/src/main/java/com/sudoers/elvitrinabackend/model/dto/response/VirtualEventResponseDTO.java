package com.sudoers.elvitrinabackend.model.dto.response;

import com.sudoers.elvitrinabackend.model.enums.EventMode;
import com.sudoers.elvitrinabackend.model.enums.EventType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirtualEventResponseDTO {
    private Long eventId;
    private String title;
    private String description;
    private LocalDateTime startDateTime; // Maps to eventDate
    private Double ticketPrice;
    private String status;
    private EventType eventType;
    private EventMode eventMode;
    private List<EventSessionResponseDTO> sessions;
    private Integer maxParticipants;
    private Integer participantCount;
    private String streamUrl;
    private String chatChannelId;
    private List<EventTicketResponseDTO> tickets;
    private List<EventParticipantResponseDTO> participants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}