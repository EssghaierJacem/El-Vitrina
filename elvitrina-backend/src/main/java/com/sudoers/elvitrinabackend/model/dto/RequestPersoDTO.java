package com.sudoers.elvitrinabackend.model.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RequestPersoDTO {
    private Long userId; // Send only the user's ID
    private String title;
    private String description;
    private float minPrice;
    private float maxPrice;
    private String image;
    private LocalDateTime deliveryTime;
    private int viewCount;
    private List<String> tags;
}
