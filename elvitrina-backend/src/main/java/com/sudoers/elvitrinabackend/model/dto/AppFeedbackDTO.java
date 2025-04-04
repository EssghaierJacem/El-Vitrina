package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.enums.AppFeedbackType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppFeedbackDTO {
    private Long id;
    private String comment;
    private LocalDateTime createdAt;
    private AppFeedbackType appFeedbackType;
    private String contactEmail;
}
