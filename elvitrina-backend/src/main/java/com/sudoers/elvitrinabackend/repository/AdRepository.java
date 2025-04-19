package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.Ad;
import com.sudoers.elvitrinabackend.model.enums.AdStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

import java.util.List;

public interface AdRepository extends JpaRepository<Ad, Long> {

    // Basic queries
    List<Ad> findByStatus(AdStatus status);
    List<Ad> findByAdvertiserEmail(String email);
    List<Ad> findByPosition(String position);

    // Active ads query
    @Query("SELECT a FROM Ad a WHERE a.isApproved = true " +
            "AND (a.startDate IS NULL OR a.startDate <= :now) " +
            "AND (a.endDate IS NULL OR a.endDate >= :now)")
    List<Ad> findActiveAds(@Param("now") LocalDateTime now);

    // For admin dashboard
    @Query("SELECT a FROM Ad a WHERE " +
            "(:status IS NULL OR a.status = :status) " +
            "AND (:advertiserEmail IS NULL OR a.advertiserEmail = :advertiserEmail)")
    List<Ad> filterAds(@Param("status") AdStatus status,
                       @Param("advertiserEmail") String advertiserEmail);

    // For maintenance
    List<Ad> findByEndDateBeforeAndIsApproved(LocalDateTime date, Boolean isApproved);

    // Optimized updates
    @Modifying
    @Query("UPDATE Ad a SET a.impressions = a.impressions + 1 WHERE a.id = :id")
    void incrementImpressions(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Ad a SET a.clicks = a.clicks + 1 WHERE a.id = :id")
    void incrementClicks(@Param("id") Long id);
}