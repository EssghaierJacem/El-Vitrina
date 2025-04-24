package com.sudoers.elvitrinabackend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewAnalysisDTO {
    
    private String originalText;
    private String summarizedText;
    private float sentimentScore;
    private float sentimentMagnitude;
    private Map<String, Object> additionalInfo = new HashMap<>();
    
    // Utility methods to interpret sentiment score
    public String getSentimentCategory() {
        if (sentimentScore >= 0.25) return "Positive";
        else if (sentimentScore <= -0.25) return "Negative";
        else return "Neutral";
    }
    
    // Get the multilingual sentiment from additionalInfo if available
    public String getMultilingualSentiment() {
        if (additionalInfo != null && additionalInfo.containsKey("multilingualSentiment")) {
            return (String) additionalInfo.get("multilingualSentiment");
        }
        return getSentimentCategory(); // Fall back to computed category
    }
    
    // Get the confidence level from additionalInfo if available
    public Float getConfidence() {
        if (additionalInfo != null && additionalInfo.containsKey("confidence")) {
            return ((Number) additionalInfo.get("confidence")).floatValue();
        }
        return null;
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