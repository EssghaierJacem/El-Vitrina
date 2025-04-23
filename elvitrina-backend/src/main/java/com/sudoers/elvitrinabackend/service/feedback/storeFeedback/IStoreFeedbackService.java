package com.sudoers.elvitrinabackend.service.feedback.storeFeedback;

import com.sudoers.elvitrinabackend.model.dto.StoreFeedbackDTO;
import com.sudoers.elvitrinabackend.model.entity.StoreFeedback;
import com.sudoers.elvitrinabackend.model.enums.StoreFeedbackType;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface IStoreFeedbackService {
    StoreFeedbackDTO saveStoreFeedback(StoreFeedbackDTO storeFeedbackDTO);
    StoreFeedbackDTO getStoreFeedbackById(Long id);
    StoreFeedbackDTO updateStoreFeedback(Long id, StoreFeedbackDTO storeFeedbackDTO);
    void deleteStoreFeedback(Long id);
    Double getAverageRatingByStoreId(Long storeId);
    Long countByStoreId(Long storeId);
    List<StoreFeedbackDTO> getFeedbacksByStoreId(Long storeId);
    Page<StoreFeedbackDTO> getAllStoreFeedbacks(int page, int size, String searchTerm);
    
    // Analytics methods
    Double getAverageRating();
    Long getTotalFeedbacks();
    Map<Integer, Long> getRatingDistribution();
    
    // New sentiment analysis methods
    List<StoreFeedbackDTO> getAnalyzedFeedbacksByStoreId(Long storeId);
    Map<String, Long> getSentimentDistributionByStoreId(Long storeId);
    Map<StoreFeedbackType, Double> getAverageSentimentByTypeForStore(Long storeId);
}