package com.sudoers.elvitrinabackend.service.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FaceAuthService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String DEEPFACE_SERVER_URL = "http://localhost:5001";

    public boolean registerFace(String userId, String imageBase64) {
        String url = DEEPFACE_SERVER_URL + "/register-face";

        Map<String, Object> request = new HashMap<>();
        request.put("userId", userId);
        request.put("imageBase64", imageBase64);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return (Boolean) response.getBody().get("success");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean verifyFace(String userId, String imageBase64) {
        String url = DEEPFACE_SERVER_URL + "/verify-face";

        Map<String, Object> request = new HashMap<>();
        request.put("userId", userId);
        request.put("imageBase64", imageBase64);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return (Boolean) response.getBody().get("match");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}