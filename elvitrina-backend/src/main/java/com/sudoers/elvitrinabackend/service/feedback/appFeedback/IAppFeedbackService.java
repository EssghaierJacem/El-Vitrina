package com.sudoers.elvitrinabackend.service.feedback.appFeedback;

import com.sudoers.elvitrinabackend.model.dto.AppFeedbackDTO;
import org.springframework.data.domain.Page;

public interface IAppFeedbackService {
    AppFeedbackDTO saveAppFeedback(AppFeedbackDTO appFeedbackDTO);
    Page<AppFeedbackDTO> getAllAppFeedbacks(int page, int size, String searchTerm);
    AppFeedbackDTO getAppFeedbackById(Long id);
    AppFeedbackDTO updateAppFeedback(Long id, AppFeedbackDTO appFeedbackDTO);
    void deleteAppFeedback(Long id);
}
