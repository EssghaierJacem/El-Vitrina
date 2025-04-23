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
    private LocalDateTime startDateTime;
    private Double ticketPrice;
    private EventType eventType;
    private EventMode eventMode;
    private Integer maxParticipants;
    private List<EventSessionRequestDTO> sessions;
    private Long storeId;
    private Long userId;
}