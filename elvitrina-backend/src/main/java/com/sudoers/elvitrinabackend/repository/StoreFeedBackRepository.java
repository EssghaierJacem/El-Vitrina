package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.StoreFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreFeedBackRepository extends JpaRepository<StoreFeedback, Long> {

    @Query("SELECT COALESCE(AVG(f.rating), 0) FROM StoreFeedback f WHERE f.store.storeId = :storeId")
    Double findAverageRatingByStoreId(@Param("storeId") Long storeId);

    List<StoreFeedback> findByStoreStoreId(Long storeId);
    // Optional: Count feedbacks for a store
    Long countByStore_StoreId(Long storeId);

    @Query("SELECT sf FROM StoreFeedback sf WHERE " +
            "LOWER(sf.comment) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(sf.storeFeedbackType) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<StoreFeedback> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
}
