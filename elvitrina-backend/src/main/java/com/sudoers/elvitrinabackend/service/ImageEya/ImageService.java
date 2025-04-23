package com.sudoers.elvitrinabackend.service.ImageEya;

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
public class ImageService {

    private static final String IMAGE_DIRECTORY = "uploads/";

    public String saveImage(MultipartFile image) throws IOException {
        Path path = Paths.get(IMAGE_DIRECTORY);
        if (!Files.exists(path)) {
            Files.createDirectories(path);  // Crée les répertoires nécessaires
        }

        // Générer un nom unique pour l'image
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path filePath = path.resolve(fileName);

        // Copier l'image dans le répertoire
        Files.copy(image.getInputStream(), filePath);

        // Retourner le nom du fichier ou le chemin relatif
        return fileName;
    }

}
