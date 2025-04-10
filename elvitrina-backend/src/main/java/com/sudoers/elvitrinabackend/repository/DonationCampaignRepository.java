package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;
import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationCampaignRepository extends JpaRepository<DonationCampaign, Long> , JpaSpecificationExecutor<DonationCampaign> {
    List<DonationCampaign> findByStatusAndEndDateAfter(String status, LocalDateTime date);
    List<DonationCampaign> findByStoreStoreId(Long storeId);

    @Query("SELECT c FROM DonationCampaign c WHERE c.featured = true AND c.status = 'ACTIVE' AND c.endDate > CURRENT_TIMESTAMP")
    List<DonationCampaign> findFeaturedActiveCampaigns();

    @Query("SELECT c FROM DonationCampaign c WHERE c.verified = true AND c.status = 'ACTIVE' AND c.endDate > CURRENT_TIMESTAMP")
    List<DonationCampaign> findVerifiedActiveCampaigns();

    @Query("SELECT COUNT(c) FROM DonationCampaign c WHERE c.currentAmount >= c.goal")
    long countSuccessfulCampaigns();
}