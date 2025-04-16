package com.sudoers.elvitrinabackend.service.user;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class CaptchaService {
    private final RestTemplate restTemplate = new RestTemplate();

    public boolean verifyCaptcha(String token) {
        String url = "https://www.google.com/recaptcha/api/siteverify";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("secret", "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe");
        params.add("response", token);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            System.out.println("Captcha verification response: " + response.getBody());

            return Boolean.TRUE.equals(response.getBody().get("success"));
        } catch (Exception e) {
            System.err.println("Captcha verification error: " + e.getMessage());
            return false;
        }
    }


}
