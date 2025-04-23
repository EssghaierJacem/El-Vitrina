package com.sudoers.elvitrinabackend.service.requestPerso;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class RequestImageService {

    private static final String IMAGE_DIRECTORY = "uploads/";

    public String saveImage(MultipartFile image) throws IOException {
        Path path = Paths.get(IMAGE_DIRECTORY);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path filePath = path.resolve(fileName);

        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    public byte[] getImage(String imageName) throws IOException {
        Path imagePath = Paths.get(IMAGE_DIRECTORY).resolve(imageName);
        return Files.readAllBytes(imagePath);
    }
}