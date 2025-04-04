package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.ProductAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductAuditRepository extends JpaRepository<ProductAudit, Long> {
    List<ProductAudit> findByProductId(Long productId);
}
