package com.sudoers.elvitrinabackend.config;

import com.sudoers.elvitrinabackend.service.user.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TokenProvider {

    private final JwtService jwtService;

    public Long getUserIdFromJWT(String token) {
        return jwtService.extractUserId(token);
    }
}
