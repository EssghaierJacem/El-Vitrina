package com.sudoers.elvitrinabackend.service.Image;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageUploadService {
    
    @Value("${app.image.base-url}")
    private String imageBaseUrl;

    @Value("${app.image.upload-dir}")
    private String uploadDir;

    public String uploadImage(MultipartFile file) {
        // Validate the image
        validateImage(file);
        
        // Generate unique filename
        String filename = generateUniqueFilename(file.getOriginalFilename());
        
        // Upload to local storage
        String imageUrl = uploadToLocalStorage(file, filename);
        
        return imageUrl;
    }
    
    private void validateImage(MultipartFile file) {
        // Check file size (e.g., max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds the maximum limit of 5MB");
        }
        
        // Check file type (e.g., only images)
        String contentType = file.getContentType();
        if (!contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }
    }
    
    private String generateUniqueFilename(String originalFilename) {
        return UUID.randomUUID() + getFileExtension(originalFilename);
    }
    
    private String getFileExtension(String filename) {
        return filename.substring(filename.lastIndexOf('.'));
    }
    
    private String uploadToLocalStorage(MultipartFile file, String filename) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            
            return imageBaseUrl + "/images/" + filename; // Return the URL
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }
}
