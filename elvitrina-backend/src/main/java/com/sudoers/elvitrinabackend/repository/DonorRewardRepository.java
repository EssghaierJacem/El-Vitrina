package com.sudoers.elvitrinabackend.repository;


import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonorRewardRepository extends JpaRepository<DonorReward, Long> {
    List<DonorReward> findByAvailableQuantityGreaterThan(int quantity);
    List<DonorReward> findByCampaignCampaignId(Long campaignId);

}

