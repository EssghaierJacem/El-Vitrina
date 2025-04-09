package com.sudoers.elvitrinabackend.model.dto.request;

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
public class VirtualEventRequestDTO {
    private String title;
    private String description;
    private LocalDateTime startDateTime; // Maps to eventDate
    private Double ticketPrice;
    private String status;
    private EventType eventType;
    private EventMode eventMode;
    private Integer maxParticipants;
    private String streamUrl;
    private String chatChannelId;
    private List<EventSessionRequestDTO> sessions; // For multi-session events
    private Long storeId; // For store relationship
    private Long userId; // For user relationship
}