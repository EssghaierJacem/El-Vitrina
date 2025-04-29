package com.sudoers.elvitrinabackend.service.blogPost.traductionService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudoers.elvitrinabackend.model.entity.GeminiAPI.TranslationRequest;
import com.sudoers.elvitrinabackend.model.entity.GeminiAPI.TranslationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GeminiApiService {
    @Value("${geminiApiKey}")
    private String geminiApiKey;
    private final String geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiApiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public TranslationResponse translateText(TranslationRequest request) {
        String prompt = buildGeminiPrompt(request);
        String geminiResponse = callGeminiApi(prompt);
        return parseGeminiResponse(geminiResponse);
    }

    private String buildGeminiPrompt(TranslationRequest request) {
        return "You are a translation service. Your task is to translate the given text.\n\n" +
                "Instructions:\n" +
                "- Translate the text to French if it is in English, and to English if it is in French.\n" +
                "Translation Request Details:\n" +
                "Text: " + request.getText() + "\n\n" +
                "Please reply in this exact JSON format:\n" +
                "{\n" +
                "  \"translatedText\": \"[The translated text]\",\n" +
                "  \"detectedSourceLanguage\": \"en\" or \"fr\"\n" +
                "}";
    }


    private String callGeminiApi(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(Map.of("text", prompt)));
        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        String url = geminiApiUrl + geminiApiKey;

        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, requestEntity, String.class);
            return responseEntity.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"candidates\": [{\"content\": {\"parts\": [{\"text\": \"Error calling Gemini API\"}]}}] }"; // Dummy error response
        }
    }

    private TranslationResponse parseGeminiResponse(String geminiResponse) {
        try {
            JsonNode root = objectMapper.readTree(geminiResponse);
            if (root.has("candidates") && root.get("candidates").isArray() && root.get("candidates").size() > 0) {
                JsonNode candidate = root.get("candidates").get(0);
                if (candidate.has("content") && candidate.get("content").has("parts") && candidate.get("content").get("parts").isArray() && candidate.get("content").get("parts").size() > 0) {
                    String fullResponse = candidate.get("content").get("parts").get(0).get("text").asText();
                    int start = fullResponse.indexOf("{");
                    int end = fullResponse.lastIndexOf("}");
                    if (start != -1 && end != -1 && end > start) {
                        String jsonString = fullResponse.substring(start, end + 1);
                        JsonNode data = objectMapper.readTree(jsonString);
                        String translatedText = data.has("translatedText") ? data.get("translatedText").asText() : "Error";
                        String detectedSourceLanguage = data.has("detectedSourceLanguage") ? data.get("detectedSourceLanguage").asText() : "unknown";
                        return new TranslationResponse(translatedText, detectedSourceLanguage);
                    } else {
                        return new TranslationResponse("Error", "Could not find JSON in Gemini response.");
                    }
                }
            }
            return new TranslationResponse("Error", "Unexpected Gemini response format.");
        } catch (IOException e) {
            e.printStackTrace();
            return new TranslationResponse("Error", "Error parsing Gemini response.");
        }
    }
}
