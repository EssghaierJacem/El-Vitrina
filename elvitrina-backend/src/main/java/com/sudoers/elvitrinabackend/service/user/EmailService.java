package com.sudoers.elvitrinabackend.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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

    public void sendVerificationEmail(String to, String firstName, String token) {
        String subject = "Welcome to El Vitrina - ! Please Verify Your Email";
        String verificationLink = "http://localhost:8081/users/verify?token=" + token;
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
}
