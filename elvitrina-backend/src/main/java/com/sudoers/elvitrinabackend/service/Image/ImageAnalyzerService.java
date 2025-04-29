package com.sudoers.elvitrinabackend.service.image;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service for analyzing product images and extracting relevant information
 */
public interface ImageAnalyzerService {
    /**
     * Analyzes an image and returns extracted information
     * 
     * @param imagePath The path to the image file
     * @return Map containing category, keywords, and description
     */
    Map<String, Object> analyzeImage(String imagePath);
    
    /**
     * Gets suggested tags for a product based on image analysis
     * 
     * @param imagePath The path to the image file
     * @return List of suggested tags extracted from the image
     */
    List<String> getSuggestedTags(String imagePath);
    
    /**
     * Gets suggested category for a product based on image analysis
     * 
     * @param imagePath The path to the image file
     * @return Optional containing suggested category if found
     */
    Optional<String> getSuggestedCategory(String imagePath);
    
    /**
     * Gets suggested description for a product based on image analysis
     * 
     * @param imagePath The path to the image file
     * @return Optional containing suggested description if found
     */
    Optional<String> getSuggestedDescription(String imagePath);
} 