package com.sudoers.elvitrinabackend.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Jacemsghaier3@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        javaMailSender.send(message);
    }

    // New method for sending HTML emails
    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("Jacemsghaier3@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true = isHtml
        javaMailSender.send(message);
    }

    public void sendVerificationEmail(String to, String firstName, String token) {
        String subject = "Welcome to El Vitrina - ! Please Verify Your Email";
        String verificationLink = "http://localhost:8080/users/verify?token=" + token;
        String text = "Dear " + firstName + ",\n\n" +
                "Please click the link below to verify your email and enable your account:\n\n" +
                verificationLink;
        sendSimpleEmail(to, subject, text);
    }

    public void sendWelcomeEmail(String to, String firstName) {
        String subject = "Welcome to El Vitrina!";
        String text = "Dear " + firstName + ",\n\n" +
                "Welcome to El Vitrina! We are excited to have you on board.";
        sendSimpleEmail(to, subject, text);
    }

    public void sendResetPasswordEmail(String to, String token) {
        String subject = "Password Reset Request - El Vitrina";
        String resetLink = "http://localhost:4200/authentication/reset-password?token=" + token;
        String text = "Hi,\n\n" +
                "Click the link below to reset your password:\n" +
                resetLink + "\n\n" +
                "If you didn’t request a password reset, please ignore this email.";
        sendSimpleEmail(to, subject, text);
    }

    public void sendDeletedRequestPersomail(String to, String userName, String requestTitle) {
        String subject = "Notification of Request Deletion - El Vitrina";
        String text = "Dear " + userName + ",\n\n" +
                "We would like to inform you that your request titled \"" + requestTitle + "\" has been reviewed and subsequently deleted from our platform, El Vitrina.\n\n" +
                "If you believe this action was taken in error or if you have any questions, please do not hesitate to contact our support team.\n\n" +
                "Thank you for your understanding.\n\n" +
                "Best regards,\n" +
                "The El Vitrina Team";
        sendSimpleEmail(to, subject, text);
    }
    public void sendApprovedRequestPersomail(String to, String userName, String requestTitle) {
        String subject = "Your Request Has Been Approved - El Vitrina";
        String text = "Dear " + userName + ",\n\n" +
                "Good news! Your request titled \"" + requestTitle + "\" has been reviewed and successfully approved on our platform, El Vitrina.\n\n" +
                "You can now continue your experience with us. If you have any further questions or need assistance, feel free to reach out to our support team.\n\n" +
                "Thank you for choosing El Vitrina.\n\n" +
                "Best regards,\n" +
                "The El Vitrina Team";
        sendSimpleEmail(to, subject, text);
    }
    public void sendAdApprovalEmail(String to, String adTitle) {
        String subject = "Your Advertisement Has Been Approved - El Vitrina";
        String text = "Dear User,\n\n" +
                "Good news! Your advertisement titled \"" + adTitle + "\" has been approved and is now active on El Vitrina.\n\n" +
                "Thank you for trusting us.\n\n" +
                "Best regards,\n" +
                "The El Vitrina Team";

        sendSimpleEmail(to, subject, text);
    }

    public void sendAdRejectionEmail(String to, String adTitle, String reason) {
        String subject = "Your Advertisement Has Been Rejected - El Vitrina";
        String text = "Dear User,\n\n" +
                "Unfortunately, your advertisement titled \"" + adTitle + "\" was rejected for the following reason:\n\n" +
                "\"" + reason + "\"\n\n" +
                "Please modify your ad and resubmit.\n\n" +
                "Best regards,\n" +
                "The El Vitrina Team";

        sendSimpleEmail(to, subject, text);
    }

}
