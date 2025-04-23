package com.sudoers.elvitrinabackend.controller.storeFeedback;

import com.sudoers.elvitrinabackend.model.dto.StoreFeedbackDTO;
import com.sudoers.elvitrinabackend.model.entity.StoreFeedback;
import com.sudoers.elvitrinabackend.model.enums.StoreFeedbackType;
import com.sudoers.elvitrinabackend.service.feedback.storeFeedback.IStoreFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/store-feedbacks")
public class StoreFeedbackController {

    @Autowired
    private IStoreFeedbackService storeFeedbackService;

    @PostMapping
    public ResponseEntity<StoreFeedbackDTO> createStoreFeedback(@RequestBody StoreFeedbackDTO storeFeedbackDTO) {
        StoreFeedbackDTO savedFeedback = storeFeedbackService.saveStoreFeedback(storeFeedbackDTO);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<StoreFeedbackDTO>> getAllStoreFeedbacks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String searchTerm) {
        Page<StoreFeedbackDTO> feedbacks = storeFeedbackService.getAllStoreFeedbacks(page, size, searchTerm);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreFeedbackDTO> getStoreFeedbackById(@PathVariable Long id) {
        StoreFeedbackDTO feedback = storeFeedbackService.getStoreFeedbackById(id);
        return ResponseEntity.ok(feedback);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreFeedbackDTO> updateStoreFeedback(
            @PathVariable Long id,
            @RequestBody StoreFeedbackDTO storeFeedbackDTO) {
        StoreFeedbackDTO updatedFeedback = storeFeedbackService.updateStoreFeedback(id, storeFeedbackDTO);
        return ResponseEntity.ok(updatedFeedback);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStoreFeedback(@PathVariable Long id) {
        storeFeedbackService.deleteStoreFeedback(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/store/{storeId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByStoreId(@PathVariable Long storeId) {
        Double averageRating = storeFeedbackService.getAverageRatingByStoreId(storeId);
        return ResponseEntity.ok(averageRating);
    }

    @GetMapping("/store/{storeId}/count")
    public ResponseEntity<Long> countByStoreId(@PathVariable Long storeId) {
        Long count = storeFeedbackService.countByStoreId(storeId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<StoreFeedbackDTO>> getFeedbacksByStoreId(@PathVariable Long storeId) {
        List<StoreFeedbackDTO> feedbacks = storeFeedbackService.getFeedbacksByStoreId(storeId);
        if (feedbacks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(feedbacks);
    }
    
    @GetMapping("/store/{storeId}/analyzed")
    public ResponseEntity<List<StoreFeedbackDTO>> getAnalyzedFeedbacksByStoreId(@PathVariable Long storeId) {
        List<StoreFeedbackDTO> analyzedFeedbacks = storeFeedbackService.getAnalyzedFeedbacksByStoreId(storeId);
        if (analyzedFeedbacks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(analyzedFeedbacks);
    }
    
    @GetMapping("/store/{storeId}/sentiment-distribution")
    public ResponseEntity<Map<String, Long>> getSentimentDistributionByStoreId(@PathVariable Long storeId) {
        Map<String, Long> distribution = storeFeedbackService.getSentimentDistributionByStoreId(storeId);
        return ResponseEntity.ok(distribution);
    }
    
    @GetMapping("/store/{storeId}/sentiment-by-type")
    public ResponseEntity<Map<StoreFeedbackType, Double>> getAverageSentimentByTypeForStore(@PathVariable Long storeId) {
        Map<StoreFeedbackType, Double> sentimentByType = storeFeedbackService.getAverageSentimentByTypeForStore(storeId);
        return ResponseEntity.ok(sentimentByType);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getFeedbackAnalytics() {
        Double averageRating = storeFeedbackService.getAverageRating();
        Long totalFeedbacks = storeFeedbackService.getTotalFeedbacks();
        Map<Integer, Long> ratingDistribution = storeFeedbackService.getRatingDistribution();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("averageRating", averageRating);
        analytics.put("totalFeedbacks", totalFeedbacks);
        analytics.put("ratingDistribution", ratingDistribution);

        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/store/{storeId}/advanced-analytics")
    public ResponseEntity<Map<String, Object>> getAdvancedAnalytics(@PathVariable Long storeId) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Basic statistics
        Double averageRating = storeFeedbackService.getAverageRatingByStoreId(storeId);
        Long totalFeedbacks = storeFeedbackService.countByStoreId(storeId);
        
        // Sentiment analysis
        Map<String, Long> sentimentDistribution = storeFeedbackService.getSentimentDistributionByStoreId(storeId);
        Map<StoreFeedbackType, Double> sentimentByType = storeFeedbackService.getAverageSentimentByTypeForStore(storeId);
        
        analytics.put("averageRating", averageRating);
        analytics.put("totalFeedbacks", totalFeedbacks);
        analytics.put("sentimentDistribution", sentimentDistribution);
        analytics.put("sentimentByFeedbackType", sentimentByType);
        
        return ResponseEntity.ok(analytics);
    }
}