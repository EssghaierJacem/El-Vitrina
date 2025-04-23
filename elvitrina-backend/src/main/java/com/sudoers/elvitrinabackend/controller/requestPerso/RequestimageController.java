package com.sudoers.elvitrinabackend.controller.requestPerso;

import com.sudoers.elvitrinabackend.service.requestPerso.RequestImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class RequestimageController {

    private final String UPLOAD_DIR = "uploads-request/";

    @Autowired
    private RequestImageService imageService;

    @PostMapping("/uploads-request")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            String fileName = imageService.saveImage(file);
            return ResponseEntity.ok(fileName);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload image");
        }
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) throws IOException {
        byte[] imageBytes = imageService.getImage(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(imageBytes);
    }
}