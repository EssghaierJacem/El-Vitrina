package com.sudoers.elvitrinabackend.service.feedback.appFeedback;

import com.sudoers.elvitrinabackend.model.entity.AppFeedback;

import java.util.List;

public interface IAppFeedbackService {
    AppFeedback saveAppFeedback(AppFeedback appFeedback); // Create
    List<AppFeedback> getAllAppFeedbacks(); // Read (All)
    AppFeedback getAppFeedbackById(Long id); // Read (ById)
    AppFeedback updateAppFeedback(Long id, AppFeedback appFeedback); // Update
    void deleteAppFeedback(Long id); // Delete
}
