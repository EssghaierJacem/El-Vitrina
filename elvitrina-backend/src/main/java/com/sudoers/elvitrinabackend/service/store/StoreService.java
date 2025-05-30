package com.sudoers.elvitrinabackend.service.store;

import com.sudoers.elvitrinabackend.exception.StoreFeatureException;
import com.sudoers.elvitrinabackend.model.dto.StoreDTO;
import com.sudoers.elvitrinabackend.model.dto.StoreStatsDTO;
import com.sudoers.elvitrinabackend.model.entity.Store;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.enums.ProductStatus;
import com.sudoers.elvitrinabackend.model.enums.StoreCategoryType;
import com.sudoers.elvitrinabackend.repository.StoreFeedBackRepository;
import com.sudoers.elvitrinabackend.repository.StoreRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import com.sudoers.elvitrinabackend.service.Image.ImageUploadService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreService implements IStoreService{
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StoreFeedBackRepository storeFeedBackRepository;
    @Autowired
    private ImageUploadService imageUploadService;

    @Transactional
    public StoreDTO createStore(StoreDTO storeDTO, MultipartFile image, MultipartFile coverImage) {
        try {
            System.out.println("Received storeDTO: " + storeDTO);

            if (storeDTO.getStoreName() == null || storeDTO.getStoreName().trim().isEmpty()) {
                throw new IllegalArgumentException("Store name is required");
            }
            if (storeDTO.getCategory() == null) {
                throw new IllegalArgumentException("Category is required");
            }
            if (storeDTO.getUserId() == null) {
                throw new IllegalArgumentException("User ID is required");
            }
            if (storeDTO.getAddress() == null || storeDTO.getAddress().trim().isEmpty()) {
                throw new IllegalArgumentException("Address is required");
            }

            StoreCategoryType.valueOf(storeDTO.getCategory().name());

            User user = userRepository.findById(storeDTO.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + storeDTO.getUserId()));

            Store store = new Store();
            copyDtoToEntity(storeDTO, store);
            store.setUser(user);

            if (image != null && !image.isEmpty()) {
                String imageUrl = saveImageToLocalDisk(image);
                store.setImage(imageUrl);
            }

            if (coverImage != null && !coverImage.isEmpty()) {
                String coverImageUrl = saveImageToLocalDisk(coverImage);
                store.setCoverImage(coverImageUrl);
            }

            store.setStatus(true);
            store.setFeatured(false);

            Store savedStore = storeRepository.save(store);

            return copyEntityToDto(savedStore);

        } catch (Exception e) {
            System.err.println("Error creating store with images: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create store", e);
        }
    }


    @Transactional(readOnly = true)
    public StoreDTO getStoreById(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        return copyEntityToDto(store);
    }

    @Transactional(readOnly = true)
    public List<StoreDTO> getAllStores() {
        return storeRepository.findAll().stream()
                .map(this::copyEntityToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StoreDTO updateStore(Long id, StoreDTO storeDTO, MultipartFile image, MultipartFile coverImage) {
        try {
            Store store = storeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Store not found"));

            copyDtoToEntity(storeDTO, store);

            if (storeDTO.getUserId() != null) {
                User user = userRepository.findById(storeDTO.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                store.setUser(user);
            }

            if (image != null && !image.isEmpty()) {
                String imageUrl = saveImageToLocalDisk(image);
                store.setImage(imageUrl);
            }

            if (coverImage != null && !coverImage.isEmpty()) {
                String coverImageUrl = saveImageToLocalDisk(coverImage);
                store.setCoverImage(coverImageUrl);
            }

            Store updatedStore = storeRepository.save(store);
            return copyEntityToDto(updatedStore);

        } catch (Exception e) {
            System.err.println("Error updating store with images: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update store", e);
        }
    }

    @Transactional
    public void deleteStore(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        storeRepository.delete(store);
    }

    // Méthodes utilitaires de conversion
    private StoreDTO copyEntityToDto(Store store) {
        return StoreDTO.builder()
                .storeId(store.getStoreId())
                .storeName(store.getStoreName())
                .description(store.getDescription())
                .category(store.getCategory())
                .categoryDisplayName(store.getCategory() != null ? store.getCategory().getDisplayName() : null)
                .createdAt(store.getCreatedAt())
                .updatedAt(store.getUpdatedAt())
                .status(store.isStatus())
                .address(store.getAddress())
                .image(store.getImage())
                .coverImage(store.getCoverImage())
                .userId(store.getUser() != null ? store.getUser().getId() : null)
                .featured(store.isFeatured())
                .build();
    }

    private void copyDtoToEntity(StoreDTO dto, Store entity) {
        try {
            System.out.println("Copying DTO to entity - DTO: " + dto);

            entity.setStoreName(dto.getStoreName().trim());
            entity.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);
            entity.setCategory(dto.getCategory());
            entity.setStatus(dto.isStatus());
            entity.setAddress(dto.getAddress().trim());
            entity.setFeatured(dto.isFeatured());

            if (dto.getImage() != null && !dto.getImage().isBlank()) {
                entity.setImage(dto.getImage().trim());
            }
            if (dto.getCoverImage() != null && !dto.getCoverImage().isBlank()) {
                entity.setCoverImage(dto.getCoverImage().trim());
            }

            System.out.println("Entity after copy: " + entity);
        } catch (Exception e) {
            System.err.println("Error in copyDtoToEntity: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<StoreDTO> getStoresByCategory(String category) {
        // 1. Valider et convertir la catégorie String en enum
        StoreCategoryType categoryType;
        try {
            categoryType = StoreCategoryType.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Catégorie invalide. Options valides : "
                    + Arrays.toString(StoreCategoryType.values()));
        }

        // 2. Rechercher avec l'enum
        List<Store> stores = storeRepository.findByCategory(categoryType);

        // 3. Convertir en DTOs
        return stores.stream()
                .map(this::copyEntityToDto)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public List<StoreDTO> searchStoresByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return Collections.emptyList(); // ou throw une exception si préféré
        }

        List<Store> stores = storeRepository.findByStoreNameContainingIgnoreCase(name);

        return stores.stream()
                .map(this::copyEntityToDto)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public List<StoreDTO> getStoresByStatus(boolean active) {
        List<Store> stores = storeRepository.findByStatus(active);
        return stores.stream()
                .map(this::copyEntityToDto)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public Page<StoreDTO> getStoresByUser(Long userId, Pageable pageable) {
        // Vérification que l'utilisateur existe
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + userId);
        }

        return storeRepository.findByUserId(userId, pageable)
                .map(this::copyEntityToDto);
    }
    @Transactional(readOnly = true)
    public StoreStatsDTO getStoreStats(Long storeId) {
        // Verify store exists
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new EntityNotFoundException("Store not found with id: " + storeId));

        // Get statistics
        Map<String, Object> stats = storeRepository.findStoreStatsById(storeId);

        // Convert to DTO
        return StoreStatsDTO.builder()
                .storeId(storeId)
                .storeName(store.getStoreName())
                .productCount(((Number) stats.getOrDefault("productCount", 0)).intValue())
                .feedbackCount(((Number) stats.getOrDefault("feedbackCount", 0)).intValue())
                .averageRating(((Number) stats.getOrDefault("averageRating", 0)).doubleValue())
                .activeProductsCount(((Number) stats.getOrDefault("activeProductsCount", 0)).intValue())
                .donationCampaignsCount(((Number) stats.getOrDefault("donationCampaignsCount", 0)).intValue())
                .virtualEventsCount(((Number) stats.getOrDefault("virtualEventsCount", 0)).intValue())
                .advertisementsCount(((Number) stats.getOrDefault("advertisementsCount", 0)).intValue())
                .build();
    }
    @Transactional
    public void toggleStoreStatus(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new EntityNotFoundException("Store not found"));

        boolean newStatus = !store.isStatus();
        store.setStatus(newStatus);

        // If deactivating store, deactivate all products
        if (!newStatus) {
            store.getProducts().forEach(product -> {
                // Only update active products to avoid overwriting other statuses
                if (product.getStatus() == ProductStatus.ACTIVE) {
                    product.setStatus(ProductStatus.INACTIVE);
                }
            });
        } else {
            // Optional: When activating store, you might want to activate inactive products
            store.getProducts().forEach(product -> {
                if (product.getStatus() == ProductStatus.INACTIVE) {
                    product.setStatus(ProductStatus.ACTIVE);
                }
            });
        }

        storeRepository.save(store);
    }
    @Transactional(readOnly = true)
    public List<StoreDTO> getFeaturedStores() {
        return storeRepository.findByFeaturedTrue().stream()
                .map(this::copyEntityToDto)
                .collect(Collectors.toList());
    }

    // Optional: Paginated version
    @Transactional(readOnly = true)
    public Page<StoreDTO> getFeaturedStores(Pageable pageable) {
        return storeRepository.findByFeaturedTrue(pageable)
                .map(this::copyEntityToDto);
    }

    @Transactional
    public void setFeaturedStatus(Long storeId, boolean featured) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new EntityNotFoundException("Store not found"));

        // Business rule: Only active stores can be featured
        if (featured && !store.isStatus()) {
            throw new StoreFeatureException("Only active stores can be featured");
        }

        // Business rule: Minimum rating requirement (4.0)
        if (featured) {
            Double averageRating = storeFeedBackRepository.findAverageRatingByStoreId(storeId);
            if (averageRating < 4.0) {
                throw new StoreFeatureException("Store rating too low for featuring. Current average: " + averageRating);
            }
        }

        store.setFeatured(featured);
        storeRepository.save(store);
    }
    @Transactional(readOnly = true)
    public Page<StoreDTO> getAllStoresPaginated(Pageable pageable) {
        return storeRepository.findAll(pageable)
                .map(this::copyEntityToDto);
    }

    // Optional filtered versions
    @Transactional(readOnly = true)
    public Page<StoreDTO> getStoresByStatusPaginated(boolean status, Pageable pageable) {
        return storeRepository.findByStatus(status, pageable)
                .map(this::copyEntityToDto);
    }

    @Transactional(readOnly = true)
    public Page<StoreDTO> getStoresByCategoryPaginated(StoreCategoryType category, Pageable pageable) {
        return storeRepository.findByCategory(category, pageable)
                .map(this::copyEntityToDto);
    }

    @Transactional(readOnly = true)
    public String getStoreNameById(Long id) {
        return storeRepository.findStoreNameById(id);
    }

    @Transactional
    public void addImageToStore(Long storeId, MultipartFile imageFile) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new EntityNotFoundException("Store not found"));

        String imageUrl = imageUploadService.uploadImage(imageFile);
        store.setImage(imageUrl); // Store the image URL
        storeRepository.save(store);
    }

    @Transactional
    public void removeImageFromStore(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new EntityNotFoundException("Store not found"));

        store.setImage(null);
        storeRepository.save(store);
    }

    private String saveImageToLocalDisk(MultipartFile image) throws IOException {
        String baseUploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "store-images";

        File uploadDirectory = new File(baseUploadDir);
        if (!uploadDirectory.exists()) {
            boolean dirsCreated = uploadDirectory.mkdirs();
            if (!dirsCreated) {
                throw new IOException("Could not create directory for image upload: " + baseUploadDir);
            }
        }

        String originalFilename = image.getOriginalFilename();
        String filename = System.currentTimeMillis() + "_" + originalFilename;

        File destFile = new File(uploadDirectory, filename);

        image.transferTo(destFile);

        return  filename;
    }

    @Transactional(readOnly = true)
    public Map<StoreCategoryType, Long> getCategoryDistribution() {
        List<Store> allStores = storeRepository.findAll();
        return allStores.stream()
                .filter(store -> store.getCategory() != null)
                .collect(Collectors.groupingBy(
                        Store::getCategory,
                        Collectors.counting()
                ));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getFeedbackAnalysis() {
        // Get overall statistics
        Double averageRating = storeFeedBackRepository.getAverageRating();
        Long totalFeedbacks = storeFeedBackRepository.getTotalFeedbackCount();
        List<Map<String, Object>> ratingDistribution = storeFeedBackRepository.getRatingDistribution();
        Long positiveFeedbacks = storeFeedBackRepository.countPositiveFeedbacks();
        Long negativeFeedbacks = storeFeedBackRepository.countNegativeFeedbacks();
        
        // Prepare the response
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("averageRating", averageRating != null ? averageRating : 0.0);
        analysis.put("totalFeedbacks", totalFeedbacks);
        analysis.put("ratingDistribution", ratingDistribution);
        analysis.put("positiveFeedbacks", positiveFeedbacks);
        analysis.put("negativeFeedbacks", negativeFeedbacks);
        
        return analysis;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getStoreCategoryDistribution() {
        List<Map<String, Object>> distribution = new ArrayList<>();
        
        // Get all stores
        List<Store> stores = storeRepository.findAll();
        
        // Count stores by category
        Map<StoreCategoryType, Long> categoryCounts = stores.stream()
                .collect(Collectors.groupingBy(Store::getCategory, Collectors.counting()));
        
        // Convert to required format
        for (Map.Entry<StoreCategoryType, Long> entry : categoryCounts.entrySet()) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("category", entry.getKey());
            categoryData.put("count", entry.getValue());
            distribution.add(categoryData);
        }
        
        return distribution;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getStoreFeedbackAnalysis() {
        List<Map<String, Object>> analysis = new ArrayList<>();
        
        // Get store feedback statistics
        List<Object[]> storeFeedbackStats = storeFeedBackRepository.getStoreFeedbackStats();
        
        for (Object[] stat : storeFeedbackStats) {
            Map<String, Object> storeAnalysis = new HashMap<>();
            Long storeId = (Long) stat[0];
            Long feedbackCount = (Long) stat[1];
            Double avgRating = (Double) stat[2];
            
            Store store = storeRepository.findById(storeId)
                    .orElseThrow(() -> new EntityNotFoundException("Store not found with id: " + storeId));
            
            storeAnalysis.put("storeId", storeId);
            storeAnalysis.put("storeName", store.getStoreName());
            storeAnalysis.put("averageRating", avgRating != null ? avgRating : 0.0);
            storeAnalysis.put("totalFeedbacks", feedbackCount != null ? feedbackCount : 0L);
            
            analysis.add(storeAnalysis);
        }
        
        return analysis;
    }

}
