package com.sudoers.elvitrinabackend.service.feedback.appFeedback;

import com.sudoers.elvitrinabackend.model.dto.AppFeedbackDTO;

import java.util.List;

public interface IAppFeedbackService {
    AppFeedbackDTO saveAppFeedback(AppFeedbackDTO appFeedbackDTO);
    List<AppFeedbackDTO> getAllAppFeedbacks();
    AppFeedbackDTO getAppFeedbackById(Long id);
    AppFeedbackDTO updateAppFeedback(Long id, AppFeedbackDTO appFeedbackDTO);
    void deleteAppFeedback(Long id);
}
