package com.sudoers.elvitrinabackend.service.feedback.storeFeedback;

import com.sudoers.elvitrinabackend.model.dto.StoreFeedbackDTO;
import com.sudoers.elvitrinabackend.model.entity.StoreFeedback;
import com.sudoers.elvitrinabackend.model.entity.Store;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.enums.StoreFeedbackType;
import com.sudoers.elvitrinabackend.repository.StoreFeedBackRepository;
import com.sudoers.elvitrinabackend.repository.StoreRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import com.sudoers.elvitrinabackend.service.ReviewAnalysis.ReviewAnalysisService;
import com.sudoers.elvitrinabackend.service.sentiment.MultilingualSentimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;
import java.util.ArrayList;

@Service
@Transactional
public class StoreFeedbackService implements IStoreFeedbackService {

    @Autowired
    private StoreFeedBackRepository storeFeedbackRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ReviewAnalysisService reviewAnalysisService;
    
    @Autowired
    private MultilingualSentimentService multilingualSentimentService;

    @Override
    public StoreFeedbackDTO saveStoreFeedback(StoreFeedbackDTO storeFeedbackDTO) {
        Store store = storeRepository.findById(storeFeedbackDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        User user = null;
        if (storeFeedbackDTO.getUserId() != null) {
            user = userRepository.findById(storeFeedbackDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        StoreFeedback storeFeedback = new StoreFeedback();
        storeFeedback.setRating(storeFeedbackDTO.getRating());
        storeFeedback.setComment(storeFeedbackDTO.getComment());
        storeFeedback.setWouldRecommend(storeFeedbackDTO.isWouldRecommend());
        storeFeedback.setStoreFeedbackType(storeFeedbackDTO.getStoreFeedbackType());
        storeFeedback.setStore(store);
        storeFeedback.setUser(user); // null is acceptable if your entity allows it
        storeFeedback.setCreatedAt(LocalDateTime.now());

        // Analyze sentiment before saving if comment is not empty
        if (storeFeedback.getComment() != null && !storeFeedback.getComment().isEmpty()) {
            // Use the improved Multilingual sentiment service as the primary sentiment analyzer
            MultilingualSentimentService.SentimentResult multilingualSentiment = 
                    multilingualSentimentService.analyzeSentiment(storeFeedback.getComment());
            
            storeFeedbackDTO.setMultilingualSentiment(multilingualSentiment.getSentiment());
            storeFeedbackDTO.setMultilingualConfidence(multilingualSentiment.getConfidence());
            
            // Convert to a compatible sentiment score and magnitude
            storeFeedbackDTO.setSentimentScore(multilingualSentiment.getSentimentScore());
            storeFeedbackDTO.setSentimentMagnitude(multilingualSentiment.getConfidence());
            
            // Generate summary using ReviewAnalysisService
            String summary = reviewAnalysisService.summarizeReview(storeFeedback.getComment());
            storeFeedbackDTO.setSummarizedComment(summary);
        }

        StoreFeedback savedFeedback = storeFeedbackRepository.save(storeFeedback);
        StoreFeedbackDTO result = convertToDTO(savedFeedback);
        
        // Transfer sentiment data from request DTO to response DTO
        result.setSentimentScore(storeFeedbackDTO.getSentimentScore());
        result.setSentimentMagnitude(storeFeedbackDTO.getSentimentMagnitude());
        result.setMultilingualSentiment(storeFeedbackDTO.getMultilingualSentiment());
        result.setMultilingualConfidence(storeFeedbackDTO.getMultilingualConfidence());
        result.setSummarizedComment(storeFeedbackDTO.getSummarizedComment());
        
        return result;
    }


    @Override
    public Page<StoreFeedbackDTO> getAllStoreFeedbacks(int page, int size, String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StoreFeedback> feedbackPage;

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            feedbackPage = storeFeedbackRepository.findBySearchTerm(searchTerm.trim(), pageable);
        } else {
            feedbackPage = storeFeedbackRepository.findAll(pageable);
        }

        return feedbackPage.map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public StoreFeedbackDTO getStoreFeedbackById(Long id) {
        return storeFeedbackRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Store feedback not found"));
    }

    @Override
    public StoreFeedbackDTO updateStoreFeedback(Long id, StoreFeedbackDTO storeFeedbackDTO) {
        StoreFeedback existingFeedback = storeFeedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store feedback not found"));

        existingFeedback.setRating(storeFeedbackDTO.getRating());
        existingFeedback.setComment(storeFeedbackDTO.getComment());
        existingFeedback.setWouldRecommend(storeFeedbackDTO.isWouldRecommend());
        existingFeedback.setStoreFeedbackType(storeFeedbackDTO.getStoreFeedbackType());

        StoreFeedback updatedFeedback = storeFeedbackRepository.save(existingFeedback);
        return convertToDTO(updatedFeedback);
    }

    @Override
    public void deleteStoreFeedback(Long id) {
        storeFeedbackRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageRatingByStoreId(Long storeId) {
        return storeFeedbackRepository.findAverageRatingByStoreId(storeId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByStoreId(Long storeId) {
        return storeFeedbackRepository.countByStore_StoreId(storeId);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageRating() {
        return storeFeedbackRepository.findOverallAverageRating();
    }

    @Override
    @Transactional(readOnly = true)
    public Long getTotalFeedbacks() {
        return storeFeedbackRepository.getTotalFeedbackCount();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Integer, Long> getRatingDistribution() {
        Map<Integer, Long> distribution = new HashMap<>();
        // Initialize all ratings with 0 count
        IntStream.rangeClosed(1, 5).forEach(rating -> distribution.put(rating, 0L));
        
        // Get actual counts for each rating
        IntStream.rangeClosed(1, 5).forEach(rating -> {
            Long count = storeFeedbackRepository.countByRating(rating);
            distribution.put(rating, count);
        });
        
        return distribution;
    }

    private StoreFeedbackDTO convertToDTO(StoreFeedback storeFeedback) {
        User user = storeFeedback.getUser();

        StoreFeedbackDTO dto = new StoreFeedbackDTO();
        dto.setStoreFeedbackId(storeFeedback.getStoreFeedbackId());
        dto.setRating(storeFeedback.getRating());
        dto.setComment(storeFeedback.getComment());
        dto.setCreatedAt(storeFeedback.getCreatedAt());
        dto.setWouldRecommend(storeFeedback.isWouldRecommend());
        dto.setStoreFeedbackType(storeFeedback.getStoreFeedbackType());
        dto.setStoreId(storeFeedback.getStore().getStoreId());
        
        if (user != null) {
            dto.setUserId(user.getId());
            dto.setUsername(user.getName());
            dto.setUserProfilePicture(user.getImage());
        }
        
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreFeedbackDTO> getFeedbacksByStoreId(Long storeId) {
        return storeFeedbackRepository.findByStoreStoreId(storeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StoreFeedbackDTO> getAnalyzedFeedbacksByStoreId(Long storeId) {
        List<StoreFeedbackDTO> feedbacks = getFeedbacksByStoreId(storeId);
        
        // Perform analysis for each feedback
        for (StoreFeedbackDTO feedback : feedbacks) {
            if (feedback.getComment() != null && !feedback.getComment().isEmpty()) {
                // Use the MultilingualSentimentService as the primary sentiment analyzer
                MultilingualSentimentService.SentimentResult multilingualSentiment = 
                        multilingualSentimentService.analyzeSentiment(feedback.getComment());
                feedback.setMultilingualSentiment(multilingualSentiment.getSentiment());
                feedback.setMultilingualConfidence(multilingualSentiment.getConfidence());
                
                // Set the legacy sentiment fields based on the multilingual result for compatibility
                feedback.setSentimentScore(multilingualSentiment.getSentimentScore());
                feedback.setSentimentMagnitude(multilingualSentiment.getConfidence());
                
                // Generate summary
                String summary = reviewAnalysisService.summarizeReview(feedback.getComment());
                feedback.setSummarizedComment(summary);
            }
        }
        
        return feedbacks;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getSentimentDistributionByStoreId(Long storeId) {
        List<StoreFeedbackDTO> analyzedFeedbacks = getAnalyzedFeedbacksByStoreId(storeId);
        
        Map<String, Long> distribution = new HashMap<>();
        distribution.put("Very Positive", 0L);
        distribution.put("Positive", 0L);
        distribution.put("Neutral", 0L);
        distribution.put("Negative", 0L);
        distribution.put("Very Negative", 0L);
        
        for (StoreFeedbackDTO feedback : analyzedFeedbacks) {
            String sentiment = feedback.getDetailedSentimentCategory();
            distribution.put(sentiment, distribution.getOrDefault(sentiment, 0L) + 1);
        }
        
        return distribution;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Map<StoreFeedbackType, Double> getAverageSentimentByTypeForStore(Long storeId) {
        List<StoreFeedbackDTO> analyzedFeedbacks = getAnalyzedFeedbacksByStoreId(storeId);
        
        Map<StoreFeedbackType, List<Float>> scoresByType = new HashMap<>();
        
        // Group sentiment scores by feedback type
        for (StoreFeedbackDTO feedback : analyzedFeedbacks) {
            StoreFeedbackType type = feedback.getStoreFeedbackType();
            if (!scoresByType.containsKey(type)) {
                scoresByType.put(type, new ArrayList<>());
            }
            scoresByType.get(type).add(feedback.getSentimentScore());
        }
        
        // Calculate average for each type
        Map<StoreFeedbackType, Double> result = new HashMap<>();
        for (Map.Entry<StoreFeedbackType, List<Float>> entry : scoresByType.entrySet()) {
            double average = entry.getValue().stream()
                    .mapToDouble(Float::doubleValue)
                    .average()
                    .orElse(0.0);
            result.put(entry.getKey(), average);
        }
        
        return result;
    }
}