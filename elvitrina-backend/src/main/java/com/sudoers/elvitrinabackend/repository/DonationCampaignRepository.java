package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationCampaignRepository extends JpaRepository<DonationCampaign, Long> {
    // Custom query methods

}