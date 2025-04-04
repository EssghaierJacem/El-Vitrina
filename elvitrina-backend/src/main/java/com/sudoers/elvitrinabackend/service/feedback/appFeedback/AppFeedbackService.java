package com.sudoers.elvitrinabackend.service.feedback.appFeedback;

import com.sudoers.elvitrinabackend.model.dto.AppFeedbackDTO;
import com.sudoers.elvitrinabackend.model.entity.AppFeedback;
import com.sudoers.elvitrinabackend.repository.AppFeedBackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AppFeedbackService implements IAppFeedbackService {

    @Autowired
    private AppFeedBackRepository appFeedbackRepository;

    @Override
    public AppFeedbackDTO saveAppFeedback(AppFeedbackDTO appFeedbackDTO) {
        AppFeedback appFeedback = new AppFeedback();
        appFeedback.setComment(appFeedbackDTO.getComment());
        appFeedback.setAppFeedbackType(appFeedbackDTO.getAppFeedbackType());
        appFeedback.setContactEmail(appFeedbackDTO.getContactEmail());
        appFeedback.setCreatedAt(LocalDateTime.now());

        AppFeedback savedFeedback = appFeedbackRepository.save(appFeedback);
        return convertToDTO(savedFeedback);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppFeedbackDTO> getAllAppFeedbacks(int page, int size, String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AppFeedback> feedbackPage;
        
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            feedbackPage = appFeedbackRepository.findBySearchTerm(searchTerm.trim(), pageable);
        } else {
            feedbackPage = appFeedbackRepository.findAll(pageable);
        }
        
        return feedbackPage.map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public AppFeedbackDTO getAppFeedbackById(Long id) {
        return appFeedbackRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("App feedback not found"));
    }

    @Override
    public AppFeedbackDTO updateAppFeedback(Long id, AppFeedbackDTO appFeedbackDTO) {
        AppFeedback existingFeedback = appFeedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("App feedback not found"));

        existingFeedback.setComment(appFeedbackDTO.getComment());
        existingFeedback.setAppFeedbackType(appFeedbackDTO.getAppFeedbackType());
        existingFeedback.setContactEmail(appFeedbackDTO.getContactEmail());

        AppFeedback updatedFeedback = appFeedbackRepository.save(existingFeedback);
        return convertToDTO(updatedFeedback);
    }

    @Override
    public void deleteAppFeedback(Long id) {
        appFeedbackRepository.deleteById(id);
    }

    private AppFeedbackDTO convertToDTO(AppFeedback appFeedback) {
        return AppFeedbackDTO.builder()
                .id(appFeedback.getId())
                .comment(appFeedback.getComment())
                .createdAt(appFeedback.getCreatedAt())
                .appFeedbackType(appFeedback.getAppFeedbackType())
                .contactEmail(appFeedback.getContactEmail())
                .build();
    }
}