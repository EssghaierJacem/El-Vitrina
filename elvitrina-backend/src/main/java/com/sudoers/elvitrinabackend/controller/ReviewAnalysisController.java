package com.sudoers.elvitrinabackend.controller;

import com.sudoers.elvitrinabackend.model.dto.ReviewAnalysisDTO;
import com.sudoers.elvitrinabackend.model.dto.StoreFeedbackDTO;
import com.sudoers.elvitrinabackend.service.ReviewAnalysis.ReviewAnalysisService;
import com.sudoers.elvitrinabackend.service.feedback.storeFeedback.IStoreFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews/analyze")
public class ReviewAnalysisController {

    @Autowired
    private ReviewAnalysisService reviewAnalysisService;
    
    @Autowired
    private IStoreFeedbackService storeFeedbackService;

    /**
     * Analyze sentiment of a given text
     * @param request The sentiment request containing the text to analyze
     * @return The sentiment analysis result
     */
    @PostMapping("/sentiment")
    public ResponseEntity<ReviewAnalysisDTO> analyzeSentiment(
            @RequestBody ReviewAnalysisDTO.SentimentRequestDTO request) {
        
        ReviewAnalysisService.SentimentResult result = 
                reviewAnalysisService.analyzeSentiment(request.getText());
        
        ReviewAnalysisDTO response = new ReviewAnalysisDTO();
        response.setOriginalText(request.getText());
        response.setSentimentScore(result.getScore());
        response.setSentimentMagnitude(result.getMagnitude());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Summarize a list of reviews
     * @param request The summarize request containing the reviews to summarize
     * @return The summarized reviews
     */
    @PostMapping("/summarize")
    public ResponseEntity<ReviewAnalysisDTO.SummarizeResponseDTO> summarizeReviews(
            @RequestBody ReviewAnalysisDTO.SummarizeRequestDTO request) {
        
        List<String> summaries = reviewAnalysisService.summarizeReviews(request.getReviews());
        ReviewAnalysisDTO.SummarizeResponseDTO response = 
                new ReviewAnalysisDTO.SummarizeResponseDTO(summaries);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get analyzed reviews for a specific store
     * @param storeId The store ID
     * @return List of analyzed reviews including sentiment and summaries
     */
    @GetMapping("/store/{storeId}")
    public ResponseEntity<ReviewAnalysisDTO.ReviewAnalysisBatchDTO> getAnalyzedReviewsForStore(
            @PathVariable Long storeId) {
        
        // Get all feedback for the store
        List<StoreFeedbackDTO> feedbacks = storeFeedbackService.getFeedbacksByStoreId(storeId);
        
        // Process each feedback
        List<ReviewAnalysisDTO> analyzedReviews = new ArrayList<>();
        for (StoreFeedbackDTO feedback : feedbacks) {
            String comment = feedback.getComment();
            if (comment == null || comment.isEmpty()) {
                continue;
            }
            
            // Analyze sentiment
            ReviewAnalysisService.SentimentResult sentimentResult = 
                    reviewAnalysisService.analyzeSentiment(comment);
            
            // Create summarized version
            String summarized = reviewAnalysisService.summarizeReview(comment);
            
            // Create response object
            ReviewAnalysisDTO analysis = new ReviewAnalysisDTO();
            analysis.setOriginalText(comment);
            analysis.setSummarizedText(summarized);
            analysis.setSentimentScore(sentimentResult.getScore());
            analysis.setSentimentMagnitude(sentimentResult.getMagnitude());
            
            analyzedReviews.add(analysis);
        }
        
        ReviewAnalysisDTO.ReviewAnalysisBatchDTO response = 
                new ReviewAnalysisDTO.ReviewAnalysisBatchDTO(analyzedReviews);
        
        return ResponseEntity.ok(response);
    }
} 