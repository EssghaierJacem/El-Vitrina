package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends  JpaRepository<Offer, Long> {

    @Query("SELECT o FROM Offer o WHERE LOWER(o.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(o.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "ORDER BY o.discount DESC")
    List<Offer> findBestMatchingOffers(@Param("keyword") String keyword);
}
