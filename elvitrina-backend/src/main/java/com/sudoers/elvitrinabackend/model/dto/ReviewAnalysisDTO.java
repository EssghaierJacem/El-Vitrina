package com.sudoers.elvitrinabackend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewAnalysisDTO {
    
    private String originalText;
    private String summarizedText;
    private float sentimentScore;
    private float sentimentMagnitude;
    
    // Utility methods to interpret sentiment score
    public String getSentimentCategory() {
        if (sentimentScore >= 0.25) return "Positive";
        else if (sentimentScore <= -0.25) return "Negative";
        else return "Neutral";
    }
    
    // For batch processing
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewAnalysisBatchDTO {
        private List<ReviewAnalysisDTO> analyzedReviews;
    }
    
    // For sentiment-only analysis
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SentimentRequestDTO {
        private String text;
    }
    
    // For summarization-only requests
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SummarizeRequestDTO {
        private List<String> reviews;
    }
    
    // For summarization-only responses
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SummarizeResponseDTO {
        private List<String> summaries;
    }
} 