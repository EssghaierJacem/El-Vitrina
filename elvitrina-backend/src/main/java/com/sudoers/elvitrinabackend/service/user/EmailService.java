package com.sudoers.elvitrinabackend.service.user;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.backend.url}")
    private String backendUrl;

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Jacemsghaier3@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        javaMailSender.send(message);
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("Jacemsghaier3@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        javaMailSender.send(message);
    }

    public void sendVerificationEmail(String to, String firstName, String token) {
        String subject = "Welcome to El Vitrina - Please Verify Your Email";
        String verificationLink = backendUrl + "/users/verify?token=" + token;
        String text = "Dear " + firstName + ",\n\n" +
                "Please click the link below to verify your email and enable your account:\n\n" +
                verificationLink + "\n\n" +
                "Best regards,\nEl Vitrina Team";
        sendSimpleEmail(to, subject, text);
    }

    public void sendWelcomeEmail(String to, String firstName) {
        String subject = "Welcome to El Vitrina!";
        String text = "Dear " + firstName + ",\n\n" +
                "Welcome to El Vitrina! We are excited to have you on board.\n\n" +
                "Best regards,\nEl Vitrina Team";
        sendSimpleEmail(to, subject, text);
    }

    public void sendResetPasswordEmail(String to, String token) {
        String subject = "Password Reset Request - El Vitrina";
        String resetLink = frontendUrl + "/authentication/reset-password?token=" + token;
        String text = "Hi,\n\n" +
                "Click the link below to reset your password:\n" +
                resetLink + "\n\n" +
                "If you didn’t request a password reset, please ignore this email.\n\n" +
                "Best regards,\nEl Vitrina Team";
        sendSimpleEmail(to, subject, text);
    }

    public void sendDeletedRequestPersomail(String to, String userName, String requestTitle) {
        String subject = "Notification of Request Deletion - El Vitrina";
        String text = "Dear " + userName + ",\n\n" +
                "Your request titled \"" + requestTitle + "\" has been deleted.\n\n" +
                "If you believe this was a mistake, contact support.\n\n" +
                "Best regards,\nEl Vitrina Team";
        sendSimpleEmail(to, subject, text);
    }

    public void sendApprovedRequestPersomail(String to, String userName, String requestTitle) {
        String subject = "Your Request Has Been Approved - El Vitrina";
        String text = "Dear " + userName + ",\n\n" +
                "Your request titled \"" + requestTitle + "\" has been approved.\n\n" +
                "Thank you for choosing El Vitrina.\n\n" +
                "Best regards,\nEl Vitrina Team";
        sendSimpleEmail(to, subject, text);
    }

    public void sendAdApprovalEmail(String to, String adTitle) {
        String subject = "Your Advertisement Has Been Approved - El Vitrina";
        String text = "Dear User,\n\n" +
                "Your advertisement \"" + adTitle + "\" is now active on El Vitrina.\n\n" +
                "Best regards,\nEl Vitrina Team";
        sendSimpleEmail(to, subject, text);
    }

    public void sendAdRejectionEmail(String to, String adTitle, String reason) {
        String subject = "Your Advertisement Has Been Rejected - El Vitrina";
        String text = "Dear User,\n\n" +
                "Your ad \"" + adTitle + "\" was rejected for the following reason:\n\n" +
                "\"" + reason + "\"\n\n" +
                "Please modify your ad and resubmit.\n\n" +
                "Best regards,\nEl Vitrina Team";
        sendSimpleEmail(to, subject, text);
    }
}
