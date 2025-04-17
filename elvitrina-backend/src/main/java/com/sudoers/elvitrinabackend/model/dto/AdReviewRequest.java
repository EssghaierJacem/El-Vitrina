package com.sudoers.elvitrinabackend.model.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdReviewRequest {
    private Boolean isApproved;
    private String position;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}