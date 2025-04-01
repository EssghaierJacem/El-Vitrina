package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.enums.StoreFeedbackType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreFeedbackDTO {
    private Long storeFeedbackId;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private Boolean wouldRecommend;
    private StoreFeedbackType storeFeedbackType;
    private Long storeId;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userImage;
}
