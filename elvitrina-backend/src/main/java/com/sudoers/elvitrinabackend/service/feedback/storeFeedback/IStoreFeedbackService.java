package com.sudoers.elvitrinabackend.service.feedback.storeFeedback;

import com.sudoers.elvitrinabackend.model.entity.StoreFeedback;

import java.util.List;

public interface IStoreFeedbackService {
    StoreFeedback saveStoreFeedback(StoreFeedback storeFeedback); // Create
    List<StoreFeedback> getAllStoreFeedbacks(); // Read (All)
    StoreFeedback getStoreFeedbackById(Long id); // Read (ById)
    StoreFeedback updateStoreFeedback(Long id, StoreFeedback storeFeedback); // Update
    void deleteStoreFeedback(Long id); // Delete
}
