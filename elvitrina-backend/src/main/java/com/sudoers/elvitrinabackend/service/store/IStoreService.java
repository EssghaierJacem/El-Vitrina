package com.sudoers.elvitrinabackend.service.store;

import com.sudoers.elvitrinabackend.model.dto.StoreDTO;
import com.sudoers.elvitrinabackend.model.dto.StoreStatsDTO;
import com.sudoers.elvitrinabackend.model.enums.StoreCategoryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IStoreService {
    StoreDTO createStore(StoreDTO storeDTO);
    StoreDTO getStoreById(Long id);
    List<StoreDTO> getAllStores();
    StoreDTO updateStore(Long id, StoreDTO storeDTO);
    void deleteStore(Long id);
    List<StoreDTO> getStoresByCategory(String category);
    List<StoreDTO> searchStoresByName(String name);
    List<StoreDTO> getStoresByStatus(boolean active);
    StoreStatsDTO getStoreStats(Long storeId);
    void toggleStoreStatus(Long storeId);
    List<StoreDTO> getFeaturedStores();
    Page<StoreDTO> getFeaturedStores(Pageable pageable);
    void setFeaturedStatus(Long storeId, boolean featured);
    //Page<StoreDTO> getAllStoresPaginated(Pageable pageable);

    // Optional filtered versions
    //Page<StoreDTO> getStoresByStatusPaginated(boolean status, Pageable pageable);
    Page<StoreDTO> getStoresByCategoryPaginated(StoreCategoryType category, Pageable pageable);
    String getStoreNameById(Long id);
}
