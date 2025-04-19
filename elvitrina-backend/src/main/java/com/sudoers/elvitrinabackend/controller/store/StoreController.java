package com.sudoers.elvitrinabackend.controller.store;

import com.sudoers.elvitrinabackend.exception.StoreFeatureException;
import com.sudoers.elvitrinabackend.model.dto.StoreDTO;
import com.sudoers.elvitrinabackend.model.dto.StoreStatsDTO;
import com.sudoers.elvitrinabackend.model.enums.StoreCategoryType;
import com.sudoers.elvitrinabackend.service.store.StoreService;
import com.sudoers.elvitrinabackend.service.Image.ImageUploadService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.net.MalformedURLException;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<StoreDTO> createStore(
            @RequestPart("store") StoreDTO storeDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage
    ) {
        StoreDTO createdStore = storeService.createStore(storeDTO, image, coverImage);
        return new ResponseEntity<>(createdStore, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDTO> getStoreById(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @GetMapping
    public ResponseEntity<List<StoreDTO>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<StoreDTO>> getAllStoresPaginated(
            @PageableDefault(size = 10, sort = "storeName", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<StoreDTO> storesPage = storeService.getAllStoresPaginated(pageable);
        return ResponseEntity.ok(storesPage);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<StoreDTO> updateStore(
            @PathVariable Long id,
            @RequestParam("storeName") String storeName,
            @RequestParam("description") String description,
            @RequestParam("category") StoreCategoryType category,
            @RequestParam("address") String address,
            @RequestParam("status") boolean status,
            @RequestParam("featured") boolean featured,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage
    ) {
        StoreDTO storeDTO = new StoreDTO();
        storeDTO.setStoreName(storeName);
        storeDTO.setDescription(description);
        storeDTO.setCategory(category);
        storeDTO.setAddress(address);
        storeDTO.setStatus(status);
        storeDTO.setFeatured(featured);

        StoreDTO updatedStore = storeService.updateStore(id, storeDTO, image, coverImage);

        return ResponseEntity.ok(updatedStore);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/category/{category}")
    public ResponseEntity<List<StoreDTO>> getStoresByCategory(
            @PathVariable String category) {
        List<StoreDTO> stores = storeService.getStoresByCategory(category);
        return ResponseEntity.ok(stores);
    }
    @GetMapping("/search")
    public ResponseEntity<List<StoreDTO>> searchStores(
            @RequestParam String name) {
        List<StoreDTO> stores = storeService.searchStoresByName(name);
        return ResponseEntity.ok(stores);
    }
    @GetMapping("/status/{status}")
    public ResponseEntity<List<StoreDTO>> getStoresByStatus(
            @PathVariable String status) {
        try {
            boolean active = parseStatus(status);
            List<StoreDTO> stores = storeService.getStoresByStatus(active);
            return ResponseEntity.ok(stores);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

    private boolean parseStatus(String status) {
        if (status == null) {
            throw new IllegalArgumentException("Le status ne peut pas être null");
        }
        String normalized = status.trim().toLowerCase();
        if (!normalized.equals("true") && !normalized.equals("false")) {
            throw new IllegalArgumentException("Le status doit être 'true' ou 'false'");
        }
        return Boolean.parseBoolean(normalized);
    }
    @GetMapping("/user/{userId}/paginated")
    public ResponseEntity<Page<StoreDTO>> getStoresByUserPaginated(
            @PathVariable Long userId,
            @PageableDefault(size = 10, sort = "storeName", direction = Sort.Direction.ASC) Pageable pageable) {

        Page<StoreDTO> storesPage = storeService.getStoresByUser(userId, pageable);
        return ResponseEntity.ok(storesPage);
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<StoreStatsDTO> getStoreStatistics(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStoreStats(id));
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> toggleStoreStatus(@PathVariable Long id) {
        storeService.toggleStoreStatus(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/featured")
    public ResponseEntity<List<StoreDTO>> getFeaturedStores() {
        return ResponseEntity.ok(storeService.getFeaturedStores());
    }

    // Optional: Paginated version
    @GetMapping("/featured/paginated")
    public ResponseEntity<Page<StoreDTO>> getFeaturedStoresPaginated(
            @PageableDefault(size = 10, sort = "storeName") Pageable pageable) {
        return ResponseEntity.ok(storeService.getFeaturedStores(pageable));
    }

    @PatchMapping("/{id}/feature")
    public ResponseEntity<?> markAsFeatured(
            @PathVariable Long id,
            @RequestParam boolean featured) {
        try {
            storeService.setFeaturedStatus(id, featured);
            return ResponseEntity.noContent().build();
        } catch (StoreFeatureException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/category/{category}/paginated")
    public ResponseEntity<Page<StoreDTO>> getStoresByCategoryPaginated(
            @PathVariable String category,
            @PageableDefault(size = 10) Pageable pageable) {
        StoreCategoryType categoryType = StoreCategoryType.valueOf(category.toUpperCase());
        return ResponseEntity.ok(storeService.getStoresByCategoryPaginated(categoryType, pageable));
    }

    @GetMapping("/{id}/name")
    public ResponseEntity<String> getStoreNameById(@PathVariable Long id) {
        String storeName = storeService.getStoreNameById(id);
        if (storeName == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(storeName);
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<Void> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        storeService.addImageToStore(id, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/images")
    public ResponseEntity<Void> removeImage(@PathVariable Long id) {
        storeService.removeImageFromStore(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/store/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads", "store-images");
            Path filePath = uploadDir.resolve(filename);

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    private String saveImage(MultipartFile file) {
        try {
            // Define the upload directory (you can change this path)
            String uploadDir = "/uploads/store-images"; // Update this path as needed
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);

            // Create the directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file to the server
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Return the relative URL for the image
            return "/uploads/store-images/" + fileName; // Adjust this based on your server configuration
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }
}
