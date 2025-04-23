package com.sudoers.elvitrinabackend.dto;

import com.sudoers.elvitrinabackend.model.entity.Product;
import lombok.Data;

@Data
public class ProductRecommendationDTO {
    private Product product;
    private double similarityScore;
    private String recommendationType;

    public ProductRecommendationDTO(Product product, double similarityScore, String recommendationType) {
        this.product = product;
        this.similarityScore = similarityScore;
        this.recommendationType = recommendationType;
    }
} 