
package com.sudoers.elvitrinabackend.controller.user;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.request.AuthenticationRequest;
import com.sudoers.elvitrinabackend.model.request.RegisterRequest;
import com.sudoers.elvitrinabackend.model.response.AuthenticationResponse;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import com.sudoers.elvitrinabackend.service.authentication.AuthenticationService;
import com.sudoers.elvitrinabackend.service.user.CaptchaService;
import com.sudoers.elvitrinabackend.service.user.JwtService;
import com.sudoers.elvitrinabackend.service.user.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;

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
    private final CaptchaService captchaService;
    private final UserRepository userRepository;
    private final JwtService jwtService;


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


    @PostMapping("/face-login")
    public ResponseEntity<AuthenticationResponse> faceLogin(@RequestParam("file") MultipartFile file) {
        try {
            String fastApiUrl = "http://localhost:5001/identify";

            WebClient webClient = WebClient.create();
            String response = webClient.post()
                    .uri(fastApiUrl)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData("uploaded_file", new ByteArrayResource(file.getBytes()) {
                        @Override
                        public String getFilename() {
                            return file.getOriginalFilename();
                        }
                    }))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response);

            if (jsonNode.has("status") && "match".equals(jsonNode.get("status").asText())) {
                String matchedFilename = jsonNode.get("matched_with").asText();

                User matchedUser = userRepository.findByImage(matchedFilename)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                var jwtToken = jwtService.generateToken(matchedUser);

                return ResponseEntity.ok(AuthenticationResponse.builder()
                        .token(jwtToken)
                        .message("Face login successful")
                        .build());

            } else {
                return ResponseEntity.status(401).body(
                        AuthenticationResponse.builder()
                                .token(null)
                                .message("Face not recognized. Please try again.")
                                .build());
            }

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    AuthenticationResponse.builder()
                            .token(null)
                            .message("Error during face login, unable to process image.")
                            .build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    AuthenticationResponse.builder()
                            .token(null)
                            .message("Server error during face login.")
                            .build());
        }
    }



    private String extractEmailFromFilename(String filename) {
        return filename.replace(".jpg", "").replace(".jpeg", "").replace(".png", "");
    }

}


