
package com.sudoers.elvitrinabackend.controller.user;

import com.sudoers.elvitrinabackend.model.request.AuthenticationRequest;
import com.sudoers.elvitrinabackend.model.request.RegisterRequest;
import com.sudoers.elvitrinabackend.model.response.AuthenticationResponse;
import com.sudoers.elvitrinabackend.service.authentication.AuthenticationService;
import com.sudoers.elvitrinabackend.service.user.CaptchaService;
import com.sudoers.elvitrinabackend.service.user.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final CaptchaService captchaService;// ✅ Inject


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        boolean isCaptchaValid = captchaService.verifyCaptcha(request.getRecaptchaToken());
        System.out.println("reCAPTCHA token received: " + request.getRecaptchaToken());

        if (!isCaptchaValid) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid reCAPTCHA. Please try again.");
            return ResponseEntity.status(403).body(
                    AuthenticationResponse.builder()
                            .token(null)
                            .message("Invalid reCAPTCHA. Please try again.")
                            .build()
            );
        }
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestParam String email) {
        userService.forgotPassword(email);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Reset password email sent successfully.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) {
        userService.resetPassword(token, newPassword);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password updated successfully.");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/google-login")
    public void redirectToGoogleLogin(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }



}


