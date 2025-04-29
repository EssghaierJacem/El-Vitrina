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
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thank You for Your Feedback</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: #f9f9f9;
                        font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
                    }
                    
                    .wrapper {
                        width: 100%;
                        table-layout: fixed;
                        padding: 40px 0;
                    }
                    
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        border-spacing: 0;
                    }
                    
                    .email-background {
                        background-color: #2a3b62;
                        background-image: url('https://drive.google.com/uc?export=view&id=1gpIPjhzrlAOyDlmZ2lGEhysM-WzsOY1L');
                        background-position: center;
                        background-repeat: repeat;
                        padding: 30px;
                    }
                    
                    .content-box {
                        background-color: white;
                        width: 85%;
                        max-width: 480px;
                        margin: 0 auto;
                        border-radius: 4px;
                        text-align: center;
                        padding: 40px 20px;
                    }
                    
                    .logo {
                        max-width: 200px;
                        height: auto;
                        margin-bottom: 30px;
                    }
                    
                    .thank-you {
                        font-size: 1.2rem;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 16px;
                    }
                    
                    .message {
                        font-size: 1rem;
                        color: #555;
                        line-height: 1.5;
                        margin-bottom: 20px;
                    }
                    
                    .footer {
                        font-size: 0.8rem;
                        color: #999;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                    }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <table class="container" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td class="email-background">
                                <table class="content-box" cellspacing="0" cellpadding="0" border="0" align="center">
                                    <tr>
                                        <td align="center">
                                            <img src="https://drive.google.com/uc?export=view&id=1Pcz1_yGgjIGk_PUo5zGA_WE_m_GT0BKf" alt="El Vitrina Logo" class="logo">
                                            
                                            <h2 class="thank-you">Thank You for Your Feedback!</h2>
                                            
                                            <p class="message">We appreciate your input and will use it to improve our app.</p>
                                            
                                            <div class="footer">
                                                © 2025 El Vitrina. All rights reserved.
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
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