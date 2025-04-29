package com.sudoers.elvitrinabackend.controller.blogPost.GeminiApiController;

import com.sudoers.elvitrinabackend.model.entity.GeminiAPI.TranslationRequest;
import com.sudoers.elvitrinabackend.model.entity.GeminiAPI.TranslationResponse;
import com.sudoers.elvitrinabackend.service.blogPost.traductionService.GeminiApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/translation")
public class TranslationController {
    private final GeminiApiService translationService;

    @Autowired
    public TranslationController(GeminiApiService translationService) {
        this.translationService = translationService;
    }

    @PostMapping("/translate")
    public ResponseEntity<TranslationResponse> translateText(
            @RequestBody TranslationRequest request) {
        try {
            TranslationResponse response = translationService.translateText(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            // Return a user-friendly error message with a 500 Internal Server Error status
            TranslationResponse errorResponse = new TranslationResponse(
                    "Translation failed: " + e.getMessage(), "unknown");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
