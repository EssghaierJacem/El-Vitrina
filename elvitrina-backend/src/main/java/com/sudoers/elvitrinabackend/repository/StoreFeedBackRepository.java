package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.StoreFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface StoreFeedBackRepository extends JpaRepository<StoreFeedback, Long> {

    @Query("SELECT COALESCE(AVG(f.rating), 0) FROM StoreFeedback f WHERE f.store.storeId = :storeId")
    Double findAverageRatingByStoreId(@Param("storeId") Long storeId);

    List<StoreFeedback> findByStoreStoreId(Long storeId);
    
    Long countByStore_StoreId(Long storeId);

    @Query("SELECT sf FROM StoreFeedback sf WHERE " +
            "LOWER(sf.comment) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(sf.storeFeedbackType) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<StoreFeedback> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT COUNT(f) FROM StoreFeedback f WHERE f.rating = :rating")
    Long countByRating(@Param("rating") Integer rating);

    @Query("SELECT COALESCE(AVG(f.rating), 0) FROM StoreFeedback f")
    Double findOverallAverageRating();

    @Query("SELECT COUNT(f) FROM StoreFeedback f")
    Long getTotalFeedbackCount();

    @Query("SELECT COALESCE(AVG(f.rating), 0) FROM StoreFeedback f")
    Double getAverageRating();

    @Query("SELECT f.rating as rating, COUNT(f) as count FROM StoreFeedback f GROUP BY f.rating")
    List<Object[]> getRatingDistributionRaw();

    @Query("SELECT new map(f.rating as rating, COUNT(f) as count) FROM StoreFeedback f GROUP BY f.rating")
    List<Map<String, Object>> getRatingDistribution();

    @Query("SELECT COUNT(f) FROM StoreFeedback f WHERE f.rating >= 4")
    Long countPositiveFeedbacks();

    @Query("SELECT COUNT(f) FROM StoreFeedback f WHERE f.rating <= 2")
    Long countNegativeFeedbacks();

    @Query("SELECT s.storeId, COUNT(f) as feedbackCount, AVG(f.rating) as avgRating " +
           "FROM Store s LEFT JOIN s.feedbacks f " +
           "GROUP BY s.storeId")
    List<Object[]> getStoreFeedbackStats();

    @Query("SELECT new map(f.storeFeedbackType as type, COUNT(f) as count) " +
           "FROM StoreFeedback f GROUP BY f.storeFeedbackType")
    List<Map<String, Object>> getFeedbackTypeDistribution();

    @Query("SELECT new map(FUNCTION('YEAR', f.createdAt) as year, " +
           "FUNCTION('MONTH', f.createdAt) as month, " +
           "COUNT(f) as count) " +
           "FROM StoreFeedback f " +
           "GROUP BY FUNCTION('YEAR', f.createdAt), FUNCTION('MONTH', f.createdAt) " +
           "ORDER BY year DESC, month DESC")
    List<Map<String, Object>> getFeedbackTrends();

    @Query("SELECT new map(s.storeName as storeName, COUNT(f) as count, AVG(f.rating) as avgRating) " +
           "FROM Store s LEFT JOIN s.feedbacks f " +
           "GROUP BY s.storeName " +
           "ORDER BY COUNT(f) DESC")
    List<Map<String, Object>> getStoreFeedbackSummary();
}
