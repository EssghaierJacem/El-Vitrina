package com.sudoers.elvitrinabackend.service.feedback.appFeedback;

import com.sudoers.elvitrinabackend.model.entity.AppFeedback;
import com.sudoers.elvitrinabackend.repository.AppFeedBackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppFeedbackService implements IAppFeedbackService{
    @Autowired
    private AppFeedBackRepository appFeedbackRepository;

    @Override
    public AppFeedback saveAppFeedback(AppFeedback appFeedback) {
        return appFeedbackRepository.save(appFeedback); // Create
    }

    @Override
    public List<AppFeedback> getAllAppFeedbacks() {
        return appFeedbackRepository.findAll(); // Read (All)
    }

    @Override
    public AppFeedback getAppFeedbackById(Long id) {
        return appFeedbackRepository.findById(id).orElse(null); // Read (ById)
    }

    @Override
    public AppFeedback updateAppFeedback(Long id, AppFeedback appFeedback) {
        AppFeedback existingAppFeedback = appFeedbackRepository.findById(id).orElse(null);
        if (existingAppFeedback != null) {
            existingAppFeedback.setComment(appFeedback.getComment());
            existingAppFeedback.setAppFeedbackType(appFeedback.getAppFeedbackType());
            existingAppFeedback.setContactEmail(appFeedback.getContactEmail());
            return appFeedbackRepository.save(existingAppFeedback); // Update
        }
        return null;
    }

    @Override
    public void deleteAppFeedback(Long id) {
        appFeedbackRepository.deleteById(id); // Delete
    }
}
