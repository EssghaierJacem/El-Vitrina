package com.sudoers.elvitrinabackend.service.feedback.appFeedback;

import com.sudoers.elvitrinabackend.model.dto.AppFeedbackDTO;
import com.sudoers.elvitrinabackend.model.entity.AppFeedback;
import com.sudoers.elvitrinabackend.repository.AppFeedBackRepository;
import com.sudoers.elvitrinabackend.service.user.EmailService;
import org.springframework.util.StringUtils; // For checking blank email
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

    @Autowired
    private EmailService emailService;

    @Override
    public AppFeedbackDTO saveAppFeedback(AppFeedbackDTO appFeedbackDTO) {
        AppFeedback appFeedback = new AppFeedback();
        appFeedback.setComment(appFeedbackDTO.getComment());
        appFeedback.setAppFeedbackType(appFeedbackDTO.getAppFeedbackType());
        appFeedback.setContactEmail(appFeedbackDTO.getContactEmail());
        appFeedback.setCreatedAt(LocalDateTime.now());

        AppFeedback savedFeedback = appFeedbackRepository.save(appFeedback);

        // Send thank you email if contactEmail is provided
        String contactEmail = appFeedbackDTO.getContactEmail();
        if (StringUtils.hasText(contactEmail)) {
            String subject = "Thank you for your feedback - El Vitrina";
            String htmlContent = """
                <html>
                <body style='font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;'>
                  <div style='max-width:500px;margin:auto;background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);padding:24px;'>
                    <h2 style='color:#222;margin-top:0;'>Thank You for Your Feedback!</h2>
                    <p style='color:#444;font-size:16px;'>We appreciate your input and will use it to improve our app.</p>
                    <div style='margin-top:32px;color:#888;font-size:13px;border-top:1px solid #eee;padding-top:12px;'>
                      &copy; 2025 El Vitrina. All rights reserved.
                    </div>
                  </div>
                </body>
                </html>
            """;
            try {
                emailService.sendHtmlEmail(contactEmail, subject, htmlContent);
            } catch (Exception e) {
                // fallback to plain text if HTML fails
                String text = "Dear user,\n\nThank you for your feedback! We appreciate your input and will use it to improve our app.\n\nBest regards,\nEl Vitrina Team";
                emailService.sendSimpleEmail(contactEmail, subject, text);
            }
        }

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