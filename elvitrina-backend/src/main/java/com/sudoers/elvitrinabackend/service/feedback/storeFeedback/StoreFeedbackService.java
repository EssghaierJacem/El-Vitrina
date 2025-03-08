package com.sudoers.elvitrinabackend.service.feedback.storeFeedback;

import com.sudoers.elvitrinabackend.model.entity.StoreFeedback;
import com.sudoers.elvitrinabackend.repository.StoreFeedBackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StoreFeedbackService implements IStoreFeedbackService {
    @Autowired
    private StoreFeedBackRepository storeFeedbackRepository;

    @Override
    public StoreFeedback saveStoreFeedback(StoreFeedback storeFeedback) {
        return storeFeedbackRepository.save(storeFeedback); // Create
    }

    @Override
    public List<StoreFeedback> getAllStoreFeedbacks() {
        return storeFeedbackRepository.findAll(); // Read (All)
    }

    @Override
    public StoreFeedback getStoreFeedbackById(Long id) {
        return storeFeedbackRepository.findById(id).orElse(null); // Read (ById)
    }

    @Override
    public StoreFeedback updateStoreFeedback(Long id, StoreFeedback storeFeedback) {
        StoreFeedback existingStoreFeedback = storeFeedbackRepository.findById(id).orElse(null);
        if (existingStoreFeedback != null) {
            existingStoreFeedback.setRating(storeFeedback.getRating());
            existingStoreFeedback.setComment(storeFeedback.getComment());
            existingStoreFeedback.setWouldRecommend(storeFeedback.isWouldRecommend());
            existingStoreFeedback.setStoreFeedbackType(storeFeedback.getStoreFeedbackType());
            existingStoreFeedback.setStore(storeFeedback.getStore());
            existingStoreFeedback.setUser(storeFeedback.getUser());
            return storeFeedbackRepository.save(existingStoreFeedback); // Update
        }
        return null;
    }

    @Override
    public void deleteStoreFeedback(Long id) {
        storeFeedbackRepository.deleteById(id); // Delete
    }
}
