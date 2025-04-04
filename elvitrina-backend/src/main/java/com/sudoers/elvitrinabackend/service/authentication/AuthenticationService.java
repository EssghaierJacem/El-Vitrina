package com.sudoers.elvitrinabackend.service.authentication;

import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.enums.RoleType;
import com.sudoers.elvitrinabackend.model.request.AuthenticationRequest;
import com.sudoers.elvitrinabackend.model.request.RegisterRequest;
import com.sudoers.elvitrinabackend.model.response.AuthenticationResponse;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import com.sudoers.elvitrinabackend.service.user.EmailService;
import com.sudoers.elvitrinabackend.service.user.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    LocalDateTime currentDateTime = LocalDateTime.now();


    public AuthenticationResponse register(RegisterRequest request) {
        String verificationToken = UUID.randomUUID().toString();

        var user = User.builder()
                .name(request.getFirstName() + " " + request.getLastName())
                .firstname(request.getFirstName())
                .lastname(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.USER)
                .status(false)
                .registrationDate(currentDateTime)
                .verificationToken(verificationToken)
                .build();

        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getFirstname(), verificationToken);

        return AuthenticationResponse.builder()
                .token(null)
                .message("Registration successful. Please verify your email to activate your account.")
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isStatus()) {
            throw new BadCredentialsException("Email not verified. Please check your inbox.");
        }

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public boolean verifyUser(String token) {
        var optionalUser = userRepository.findByVerificationToken(token);

        if (optionalUser.isPresent()) {
            var user = optionalUser.get();
            user.setStatus(true);
            user.setVerificationToken(null);
            userRepository.save(user);
            emailService.sendWelcomeEmail(user.getEmail(), user.getFirstname());
            return true;
        }

        return false;
    }
}
