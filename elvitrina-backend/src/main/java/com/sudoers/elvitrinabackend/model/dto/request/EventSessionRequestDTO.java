package com.sudoers.elvitrinabackend.model.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventSessionRequestDTO {
    private Long virtualEventId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String sessionTitle;
}