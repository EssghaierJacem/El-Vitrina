package com.sudoers.elvitrinabackend.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecentActivityDTO {
    private Long id;
    private String time;
    private String color;
    private String title;
    private String description;
    private String link;

    @JsonIgnore
    private LocalDateTime realDate;
}