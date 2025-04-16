package com.sudoers.elvitrinabackend.config;

import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.enums.RoleType;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import com.sudoers.elvitrinabackend.service.user.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String providerId = oauthUser.getAttribute("id");

        if (email == null || email.isBlank()) {
            email = "user_" + providerId + "@facebookuser.com";
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setFirstname(name);
                    newUser.setName("GoogleUser");
                    newUser.setLastname("OAuth");
                    newUser.setPassword(UUID.randomUUID().toString());
                    newUser.setStatus(true);
                    newUser.setRole(RoleType.USER);
                    return userRepository.save(newUser);
                });

        String token = jwtService.generateToken(user);

        response.sendRedirect("http://localhost:4200/oauth-success?token=" + token);
    }
}
