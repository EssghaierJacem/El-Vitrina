package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventSessionResponseDTO {
    private Long sessionId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String sessionTitle;
    private Long virtualEventId;
    private String streamUrl;
}