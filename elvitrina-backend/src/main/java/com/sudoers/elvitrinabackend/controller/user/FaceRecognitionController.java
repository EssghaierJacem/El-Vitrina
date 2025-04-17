package com.sudoers.elvitrinabackend.controller.user;


import com.sudoers.elvitrinabackend.service.user.FaceRecognitionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FaceRecognitionController {

    private final FaceRecognitionService faceRecognitionService;

    public FaceRecognitionController(FaceRecognitionService faceRecognitionService) {
        this.faceRecognitionService = faceRecognitionService;
    }

        @GetMapping("/api/face-recognition/test")
    public String testFaceRecognition() {
        return faceRecognitionService.runFaceRecognition();
    }
}
