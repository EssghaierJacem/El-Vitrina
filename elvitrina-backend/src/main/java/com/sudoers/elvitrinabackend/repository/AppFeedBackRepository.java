package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.AppFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AppFeedBackRepository extends JpaRepository<AppFeedback, Long> {
    @Query("SELECT f FROM AppFeedback f WHERE " +
           "LOWER(f.comment) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.appFeedbackType) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.contactEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<AppFeedback> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
}
