package com.sudoers.elvitrinabackend.service.store;

import com.sudoers.elvitrinabackend.model.dto.StoreDTO;
import com.sudoers.elvitrinabackend.model.dto.StoreStatsDTO;
import com.sudoers.elvitrinabackend.model.enums.StoreCategoryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface IStoreService {
    StoreDTO createStore(StoreDTO storeDTO, MultipartFile image, MultipartFile coverImage);
    StoreDTO getStoreById(Long id);
    List<StoreDTO> getAllStores();
    Page<StoreDTO> getAllStoresPaginated(Pageable pageable);
    StoreDTO updateStore(Long id, StoreDTO storeDTO, MultipartFile image, MultipartFile coverImage);
    void deleteStore(Long id);
    List<StoreDTO> getStoresByCategory(String category);
    List<StoreDTO> searchStoresByName(String name);
    List<StoreDTO> getStoresByStatus(boolean status);
    Page<StoreDTO> getStoresByUser(Long userId, Pageable pageable);
    StoreStatsDTO getStoreStats(Long storeId);
    void toggleStoreStatus(Long id);
    List<StoreDTO> getFeaturedStores();
    Page<StoreDTO> getFeaturedStores(Pageable pageable);
    void setFeaturedStatus(Long id, boolean featured);
    Page<StoreDTO> getStoresByCategoryPaginated(StoreCategoryType category, Pageable pageable);
    String getStoreNameById(Long id);
    void addImageToStore(Long id, MultipartFile file);
    void removeImageFromStore(Long id);
    
    // Statistics methods
    List<Map<String, Object>> getStoreCategoryDistribution();
    List<Map<String, Object>> getStoreFeedbackAnalysis();
}
