package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.StoreFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreFeedBackRepository extends JpaRepository<StoreFeedback, Long> {
}
