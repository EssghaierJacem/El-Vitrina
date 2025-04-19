package com.sudoers.elvitrinabackend.service;

import com.sudoers.elvitrinabackend.model.dto.ProductRecommendation;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class RecoService {

    public List<ProductRecommendation> getRecommendations(List<String> responses) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:5000/recommend";

        Map<String, Object> request = new HashMap<>();
        request.put("responses", responses);  // Envoie les réponses du quiz

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request);

        ResponseEntity<ProductRecommendation[]> response =
                restTemplate.postForEntity(url, entity, ProductRecommendation[].class);

        return Arrays.asList(Objects.requireNonNull(response.getBody()));
    }
}
