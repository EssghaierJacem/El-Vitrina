package com.sudoers.elvitrinabackend.model.dto.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Data
public class EventSessionRequestDTO {
    private Long virtualEventId;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private String sessionTitle;
    private String streamUrl;

}