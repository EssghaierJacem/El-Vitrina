package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.enums.StoreFeedbackType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoreFeedbackDTO {
    private Long storeFeedbackId;
    private Long storeId;
    private Long userId;
    private String username;
    private String userProfilePicture;
    private int rating;
    private String comment;
    private String summarizedComment;
    private float sentimentScore;
    private float sentimentMagnitude;
    private LocalDateTime createdAt;
    private boolean wouldRecommend;
    private StoreFeedbackType storeFeedbackType;
    
    // Helper method to get sentiment category based on score
    public String getSentimentCategory() {
        if (sentimentScore >= 0.25) return "Positive";
        else if (sentimentScore <= -0.25) return "Negative";
        else return "Neutral";
    }
}
