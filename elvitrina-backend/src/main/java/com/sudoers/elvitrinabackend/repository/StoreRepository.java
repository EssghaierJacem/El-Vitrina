package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.Store;
import com.sudoers.elvitrinabackend.model.enums.StoreCategoryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long>  {
    List<Store> findByCategory(StoreCategoryType category);
    List<Store> findByStoreNameContainingIgnoreCase(String name);
    List<Store> findByStatus(boolean status);
    Page<Store> findByUserId(Long userId, Pageable pageable);
    @Query("SELECT " +
            "COUNT(p) as productCount, " +
            "COUNT(f) as feedbackCount, " +
            "COALESCE(AVG(f.rating), 0) as averageRating, " +
            "SUM(CASE WHEN p.status = com.sudoers.elvitrinabackend.model.enums.ProductStatus.ACTIVE THEN 1 ELSE 0 END) as activeProductsCount, " +
            "COUNT(dc) as donationCampaignsCount, " +
            "COUNT(ve) as virtualEventsCount, " +
            "COUNT(a) as advertisementsCount " +
            "FROM Store s " +
            "LEFT JOIN s.products p " +
            "LEFT JOIN s.feedbacks f " +
            "LEFT JOIN s.donationCampaigns dc " +
            "LEFT JOIN s.virtualEvents ve " +
            "LEFT JOIN s.advertisements a " +
            "WHERE s.storeId = :storeId " +
            "GROUP BY s.storeId")
    Map<String, Object> findStoreStatsById(@Param("storeId") Long storeId);
    List<Store> findByFeaturedTrue();
    Page<Store> findByFeaturedTrue(Pageable pageable);
    Page<Store> findAll(Pageable pageable);

    // Optional: Filtered pagination
    Page<Store> findByStatus(boolean status, Pageable pageable);
    Page<Store> findByCategory(StoreCategoryType category, Pageable pageable);
}
