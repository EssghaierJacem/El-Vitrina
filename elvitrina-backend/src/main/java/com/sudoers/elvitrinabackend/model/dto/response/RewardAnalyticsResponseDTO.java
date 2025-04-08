package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardAnalyticsResponseDTO {
    private Long totalRewardsCreated;
    private Long totalRewardsClaimed;
    private BigDecimal averageDonationWithReward;
    private BigDecimal averageDonationWithoutReward;
    private Double claimRate; // percentage of available rewards claimed
    private List<RewardPerformanceDTO> topPerformingRewards;
    private Map<String, Long> rewardsByStatus;
    private Map<String, Long> rewardsByTier;
}