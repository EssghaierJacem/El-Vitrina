package com.sudoers.elvitrinabackend.controller;

import com.sudoers.elvitrinabackend.dto.ProductRecommendationDTO;
import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import com.sudoers.elvitrinabackend.service.ProductRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class ProductRecommendationController {

    @Autowired
    private ProductRecommendationService recommendationService;

    @PostMapping("/visual")
    public ResponseEntity<List<ProductRecommendationDTO>> getVisualRecommendations(
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam(value = "limit", defaultValue = "10") int limit) {
        try {
            List<ProductRecommendationDTO> recommendations = 
                recommendationService.getVisualRecommendations(imageFile, limit);
            return ResponseEntity.ok(recommendations);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/text")
    public ResponseEntity<List<ProductRecommendationDTO>> getTextBasedRecommendations(
            @RequestParam("query") String query,
            @RequestParam(value = "limit", defaultValue = "10") int limit) {
        List<ProductRecommendationDTO> recommendations = 
            recommendationService.getTextBasedRecommendations(query, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductRecommendationDTO>> getCategoryBasedRecommendations(
            @PathVariable("category") ProductCategoryType category,
            @RequestParam(value = "limit", defaultValue = "10") int limit) {
        List<ProductRecommendationDTO> recommendations = 
            recommendationService.getCategoryBasedRecommendations(category, limit);
        return ResponseEntity.ok(recommendations);
    }
} 