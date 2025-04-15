package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.ProposalPerso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposalPersoRepository extends JpaRepository<ProposalPerso, Long> {
    List<ProposalPerso> findProposalPersoByRequestPersoId(Long requestPersoId);
    // Basic paginated findAll
    Page<ProposalPerso> findAll(Pageable pageable);

    // Find by request with pagination
    Page<ProposalPerso> findByRequestPerso_Id(Long requestId, Pageable pageable);

    // Find by user with pagination
    Page<ProposalPerso> findByUser_Id(Long userId, Pageable pageable);

    // Find by price range
    @Query("SELECT p FROM ProposalPerso p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    Page<ProposalPerso> findByPriceRange(
            @Param("minPrice") double minPrice,
            @Param("maxPrice") double maxPrice,
            Pageable pageable);
}