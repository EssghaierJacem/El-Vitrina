package com.sudoers.elvitrinabackend.service.image;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ImageAnalyzerServiceImpl implements ImageAnalyzerService {
    private static final Logger logger = LoggerFactory.getLogger(ImageAnalyzerServiceImpl.class);
    private final ObjectMapper objectMapper;
    
    @Value("${image.analyzer.python.path}")
    private String pythonPath;
    
    @Value("${image.analyzer.script.path}")
    private String scriptPath;
    
    public ImageAnalyzerServiceImpl() {
        this.objectMapper = new ObjectMapper();
    }
    
    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> analyzeImage(String imagePath) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    pythonPath,
                    scriptPath,
                    "--image", imagePath
            );
            
            Process process = processBuilder.start();
            
            // Read the output from the Python script
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            StringBuilder output = new StringBuilder();
            
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            
            // Wait for the process to complete
            int exitCode = process.waitFor();
            
            if (exitCode != 0) {
                logger.error("Python script execution failed with exit code: " + exitCode);
                return Collections.emptyMap();
            }
            
            // Parse the JSON output
            return objectMapper.readValue(output.toString(), Map.class);
            
        } catch (Exception e) {
            logger.error("Error running image analysis: " + e.getMessage(), e);
            return Collections.emptyMap();
        }
    }
    
    @Override
    @SuppressWarnings("unchecked")
    public List<String> getSuggestedTags(String imagePath) {
        Map<String, Object> analysisResult = analyzeImage(imagePath);
        if (analysisResult.isEmpty()) {
            return Collections.emptyList();
        }
        
        List<String> keywords = (List<String>) analysisResult.get("keywords");
        return keywords != null ? keywords : Collections.emptyList();
    }
    
    @Override
    public Optional<String> getSuggestedCategory(String imagePath) {
        Map<String, Object> analysisResult = analyzeImage(imagePath);
        if (analysisResult.isEmpty()) {
            return Optional.empty();
        }
        
        String category = (String) analysisResult.get("category");
        return Optional.ofNullable(category);
    }
    
    @Override
    public Optional<String> getSuggestedDescription(String imagePath) {
        Map<String, Object> analysisResult = analyzeImage(imagePath);
        if (analysisResult.isEmpty()) {
            return Optional.empty();
        }
        
        String description = (String) analysisResult.get("description");
        return Optional.ofNullable(description);
    }
} 