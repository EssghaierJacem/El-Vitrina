package com.sudoers.elvitrinabackend.service.feedback.storeFeedback;

import com.sudoers.elvitrinabackend.model.dto.StoreFeedbackDTO;
import com.sudoers.elvitrinabackend.model.entity.StoreFeedback;

import java.util.List;

public interface IStoreFeedbackService {
    StoreFeedbackDTO saveStoreFeedback(StoreFeedbackDTO storeFeedbackDTO);
    List<StoreFeedbackDTO> getAllStoreFeedbacks();
    StoreFeedbackDTO getStoreFeedbackById(Long id);
    StoreFeedbackDTO updateStoreFeedback(Long id, StoreFeedbackDTO storeFeedbackDTO);
    void deleteStoreFeedback(Long id);
    Double getAverageRatingByStoreId(Long storeId);
    Long countByStoreId(Long storeId);
}
