package com.sudoers.elvitrinabackend.service;

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import com.sudoers.elvitrinabackend.dto.ProductRecommendationDTO;
import com.sudoers.elvitrinabackend.model.entity.Product;
import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import com.sudoers.elvitrinabackend.repository.ProductRepository;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductRecommendationService {

    @Autowired
    private ProductRepository productRepository;

    private static final String VISUAL_TYPE = "VISUAL";
    private static final String TEXT_TYPE = "TEXT";
    private static final String CATEGORY_TYPE = "CATEGORY";

    public List<ProductRecommendationDTO> getVisualRecommendations(MultipartFile imageFile, int limit) throws IOException {
        // Convert MultipartFile to ByteString for Google Cloud Vision API
        byte[] imageBytes = imageFile.getBytes();
        ByteString imgBytes = ByteString.copyFrom(imageBytes);

        // Create image object for Vision API
        Image img = Image.newBuilder().setContent(imgBytes).build();
        Feature feat = Feature.newBuilder().setType(Feature.Type.LABEL_DETECTION).build();
        AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                .addFeatures(feat)
                .setImage(img)
                .build();

        // Initialize Vision API client and detect labels
        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {
            AnnotateImageResponse response = vision.batchAnnotateImages(
                    Collections.singletonList(request)).getResponses(0);

            // Extract labels from the response
            List<String> labels = response.getLabelAnnotationsList().stream()
                    .map(EntityAnnotation::getDescription)
                    .collect(Collectors.toList());

            // Get all products
            List<Product> allProducts = productRepository.findAll();

            // Calculate similarity scores using Jaccard similarity
            return allProducts.stream()
                    .map(product -> {
                        double similarity = calculateJaccardSimilarity(
                                labels,
                                Arrays.asList(product.getProductName().toLowerCase().split("\\s+"))
                        );
                        return new ProductRecommendationDTO(product, similarity, VISUAL_TYPE);
                    })
                    .sorted(Comparator.comparingDouble(ProductRecommendationDTO::getSimilarityScore).reversed())
                    .limit(limit)
                    .collect(Collectors.toList());
        }
    }

    public List<ProductRecommendationDTO> getTextBasedRecommendations(String query, int limit) {
        List<Product> allProducts = productRepository.findAll();
        LevenshteinDistance levenshtein = new LevenshteinDistance();

        return allProducts.stream()
                .map(product -> {
                    int distance = levenshtein.apply(
                            query.toLowerCase(),
                            product.getProductName().toLowerCase()
                    );
                    // Normalize the distance to a similarity score between 0 and 1
                    double maxLength = Math.max(query.length(), product.getProductName().length());
                    double similarity = 1.0 - (distance / maxLength);
                    return new ProductRecommendationDTO(product, similarity, TEXT_TYPE);
                })
                .sorted(Comparator.comparingDouble(ProductRecommendationDTO::getSimilarityScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<ProductRecommendationDTO> getCategoryBasedRecommendations(ProductCategoryType category, int limit) {
        List<Product> categoryProducts = productRepository.findByCategory(category);

        return categoryProducts.stream()
                .map(product -> new ProductRecommendationDTO(product, 1.0, CATEGORY_TYPE))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private double calculateJaccardSimilarity(List<String> list1, List<String> list2) {
        Set<String> set1 = new HashSet<>(list1);
        Set<String> set2 = new HashSet<>(list2);

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
    }
} 