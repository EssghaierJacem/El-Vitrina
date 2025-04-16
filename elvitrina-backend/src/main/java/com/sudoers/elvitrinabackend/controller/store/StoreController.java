package com.sudoers.elvitrinabackend.controller.store;

import com.sudoers.elvitrinabackend.exception.StoreFeatureException;
import com.sudoers.elvitrinabackend.model.dto.StoreDTO;
import com.sudoers.elvitrinabackend.model.dto.StoreStatsDTO;
import com.sudoers.elvitrinabackend.model.enums.StoreCategoryType;
import com.sudoers.elvitrinabackend.service.store.StoreService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")

@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @PostMapping
    public ResponseEntity<StoreDTO> createStore(@RequestBody StoreDTO storeDTO) {
        StoreDTO createdStore = storeService.createStore(storeDTO);
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

    @PutMapping("/{id}")
    public ResponseEntity<StoreDTO> updateStore(@PathVariable Long id, @RequestBody StoreDTO storeDTO) {
        return ResponseEntity.ok(storeService.updateStore(id, storeDTO));
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
}
