package com.sudoers.elvitrinabackend.controller.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/corrections")
@RequiredArgsConstructor
public class CorrectionController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public String correctText(@RequestBody String text) {
        String apiUrl = "https://api.languagetool.org/v2/check";

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("text", text);
        body.add("language", "en-US");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, requestEntity, Map.class);

        List<Map<String, Object>> matches = (List<Map<String, Object>>) response.getBody().get("matches");

        if (matches != null && !matches.isEmpty()) {
            Map<String, Object> firstMatch = matches.get(0);
            List<Map<String, String>> replacements = (List<Map<String, String>>) firstMatch.get("replacements");

            if (replacements != null && !replacements.isEmpty()) {
                return replacements.get(0).get("value");
            }
        }
        return text;
    }
}