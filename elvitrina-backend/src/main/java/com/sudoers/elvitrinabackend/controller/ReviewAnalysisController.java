package com.sudoers.elvitrinabackend.controller;

import com.sudoers.elvitrinabackend.model.dto.ReviewAnalysisDTO;
import com.sudoers.elvitrinabackend.model.dto.StoreFeedbackDTO;
import com.sudoers.elvitrinabackend.service.ReviewAnalysis.ReviewAnalysisService;
import com.sudoers.elvitrinabackend.service.feedback.storeFeedback.IStoreFeedbackService;
import com.sudoers.elvitrinabackend.service.sentiment.MultilingualSentimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews/analyze")
public class ReviewAnalysisController {

    @Autowired
    private ReviewAnalysisService reviewAnalysisService;
    
    @Autowired
    private IStoreFeedbackService storeFeedbackService;
    
    @Autowired
    private MultilingualSentimentService multilingualSentimentService;

    /**
     * Analyze sentiment of a given text
     * @param request The sentiment request containing the text to analyze
     * @return The sentiment analysis result
     */
    @PostMapping("/sentiment")
    public ResponseEntity<ReviewAnalysisDTO> analyzeSentiment(
            @RequestBody ReviewAnalysisDTO.SentimentRequestDTO request) {
        
        // Use the MultilingualSentimentService directly for better results
        MultilingualSentimentService.SentimentResult mlResult = 
                multilingualSentimentService.analyzeSentiment(request.getText());
        
        // Also get the compatible result from ReviewAnalysisService for consistency
        ReviewAnalysisService.SentimentResult result = 
                reviewAnalysisService.analyzeSentiment(request.getText());
        
        ReviewAnalysisDTO response = new ReviewAnalysisDTO();
        response.setOriginalText(request.getText());
        response.setSentimentScore(result.getScore());
        response.setSentimentMagnitude(result.getMagnitude());
        
        // Add multilingual sentiment information
        Map<String, Object> additionalInfo = new HashMap<>();
        additionalInfo.put("multilingualSentiment", mlResult.getSentiment());
        additionalInfo.put("confidence", mlResult.getConfidence());
        response.setAdditionalInfo(additionalInfo);
        
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
     * Get analyzed reviews for a store
     * @param storeId The store ID to get reviews for
     * @return The analyzed reviews
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
            
            // Use MultilingualSentimentService for better analysis
            MultilingualSentimentService.SentimentResult mlResult = 
                    multilingualSentimentService.analyzeSentiment(comment);
                    
            // Get sentiment score for compatibility
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
            
            // Add multilingual sentiment info
            Map<String, Object> additionalInfo = new HashMap<>();
            additionalInfo.put("multilingualSentiment", mlResult.getSentiment());
            additionalInfo.put("confidence", mlResult.getConfidence());
            analysis.setAdditionalInfo(additionalInfo);
            
            analyzedReviews.add(analysis);
        }
        
        ReviewAnalysisDTO.ReviewAnalysisBatchDTO response = 
                new ReviewAnalysisDTO.ReviewAnalysisBatchDTO(analyzedReviews);
        
        return ResponseEntity.ok(response);
    }
} 