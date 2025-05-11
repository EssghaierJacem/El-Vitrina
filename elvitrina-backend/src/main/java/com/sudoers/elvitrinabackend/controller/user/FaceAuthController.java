package com.sudoers.elvitrinabackend.controller.user;

import com.sudoers.elvitrinabackend.service.user.FaceAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/face")
@RequiredArgsConstructor
public class FaceAuthController {

    private final FaceAuthService faceAuthService;

    @PostMapping("/register")
    public boolean registerFace(@RequestParam String userId, @RequestParam String imageBase64) {
        return faceAuthService.registerFace(userId, imageBase64);
    }

    @PostMapping("/login")
    public boolean verifyFace(@RequestParam String userId, @RequestParam String imageBase64) {
        return faceAuthService.verifyFace(userId, imageBase64);
    }
}
