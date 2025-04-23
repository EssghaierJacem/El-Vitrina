package com.sudoers.elvitrinabackend.service.DonorReward;
import com.sudoers.elvitrinabackend.model.dto.request.DonorRewardRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonorRewardResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;
import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import com.sudoers.elvitrinabackend.repository.DonationCampaignRepository;
import com.sudoers.elvitrinabackend.repository.DonorRewardRepository;
import com.sudoers.elvitrinabackend.model.mapper.DonorRewardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.sudoers.elvitrinabackend.model.dto.request.RewardTierRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.RewardFulfillmentRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.RewardTierResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.RewardAnalyticsResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.RewardPerformanceDTO;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
@Service
public class DonorRewardServiceImpl implements DonorRewardService {

    @Autowired
    private DonorRewardRepository donorRewardRepository;

    @Autowired
    private DonorRewardMapper donorRewardMapper;

    @Autowired
    private DonationCampaignRepository campaignRepository;
    @Override
    public DonorRewardResponseDTO saveDonorReward(DonorRewardRequestDTO dto) {
        DonorReward entity = donorRewardMapper.toEntity(dto);
        return donorRewardMapper.toResponseDTO(donorRewardRepository.save(entity));
    }

    @Override
    public DonorRewardResponseDTO getDonorRewardById(Long id) {
        DonorReward reward = donorRewardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DonorReward not found"));
        return donorRewardMapper.toResponseDTO(reward);
    }

    @Override
    public void deleteDonorReward(Long id) {
        donorRewardRepository.deleteById(id);
    }

    @Override
    public DonorRewardResponseDTO updateDonorReward(Long id, DonorRewardRequestDTO dto) {
        DonorReward reward = donorRewardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DonorReward not found"));

        reward.setTitle(dto.getTitle());
        reward.setDescription(dto.getDescription());
        reward.setMinimumDonationAmount(dto.getMinimumDonationAmount() != null ?
                dto.getMinimumDonationAmount().doubleValue() : null);
        reward.setAvailableQuantity(dto.getAvailableQuantity());

        return donorRewardMapper.toResponseDTO(donorRewardRepository.save(reward));
    }

    @Override
    public List<DonorRewardResponseDTO> getAllRewards() {
        return donorRewardRepository.findAll()
                .stream()
                .map(donorRewardMapper::toResponseDTO)
                .collect(Collectors.toList());
    }


    // Add these methods to your existing DonorRewardServiceImpl class


    @Override
    public RewardAnalyticsResponseDTO getRewardAnalytics() {
        // Implement logic to gather analytics data
        List<DonorReward> allRewards = donorRewardRepository.findAll();
        long totalRewardsCreated = allRewards.size();
        long totalRewardsClaimed = allRewards.stream()
                .mapToLong(DonorReward::getClaimedQuantity)
                .sum();

        // Calculate average donations with and without rewards
        // This is a placeholder - you'll need to implement based on your donation data structure
        BigDecimal avgDonationWithReward = calculateAverageDonationWithReward();
        BigDecimal avgDonationWithoutReward = calculateAverageDonationWithoutReward();

        // Calculate claim rate
        double claimRate = calculateClaimRate(allRewards);

        // Get top performing rewards
        List<RewardPerformanceDTO> topPerforming = getTopPerformingRewards();

        // Get rewards by status
        Map<String, Long> rewardsByStatus = getRewardsByStatus();

        // Get rewards by tier
        Map<String, Long> rewardsByTier = getRewardsByTier();

        return RewardAnalyticsResponseDTO.builder()
                .totalRewardsCreated(totalRewardsCreated)
                .totalRewardsClaimed(totalRewardsClaimed)
                .averageDonationWithReward(avgDonationWithReward)
                .averageDonationWithoutReward(avgDonationWithoutReward)
                .claimRate(claimRate)
                .topPerformingRewards(topPerforming)
                .rewardsByStatus(rewardsByStatus)
                .rewardsByTier(rewardsByTier)
                .build();
    }

    @Override
    public List<DonorRewardResponseDTO> getRewardsByStoreId(Long storeId) {
        // First find campaigns associated with the store
        List<DonationCampaign> storeCampaigns = campaignRepository.findByStoreStoreId(storeId);

        // Get all rewards for these campaigns
        List<DonorReward> storeRewards = new ArrayList<>();
        for (DonationCampaign campaign : storeCampaigns) {
            List<DonorReward> campaignRewards = donorRewardRepository.findByCampaignCampaignId(campaign.getCampaignId());
            storeRewards.addAll(campaignRewards);
        }

        // Convert to DTOs and return
        return storeRewards.stream()
                .map(donorRewardMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DonorRewardResponseDTO updateRewardFulfillment(Long id, RewardFulfillmentRequestDTO dto) {
        // Implement logic to update fulfillment status
        DonorReward reward = donorRewardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DonorReward not found"));

        reward.setRedemptionStatus(dto.getFulfillmentStatus());
        reward.setRedemptionDate(dto.getFulfillmentDate() != null ?
                dto.getFulfillmentDate() : LocalDateTime.now());

        // If your entity doesn't have these fields, you might need to add them
        // or create a separate fulfillment entity
        // reward.setTrackingNumber(dto.getTrackingNumber());
        // reward.setFulfillmentNotes(dto.getFulfillmentNotes());

        DonorReward updatedReward = donorRewardRepository.save(reward);
        return donorRewardMapper.toResponseDTO(updatedReward);
    }

    // Helper methods for analytics
    private BigDecimal calculateAverageDonationWithReward() {
        // Implement logic to calculate average donation amount where a reward was claimed
        // This is a placeholder implementation
        return BigDecimal.valueOf(50.0);  // Example value
    }

    private BigDecimal calculateAverageDonationWithoutReward() {
        // Implement logic to calculate average donation amount where no reward was claimed
        // This is a placeholder implementation
        return BigDecimal.valueOf(25.0);  // Example value
    }

    private double calculateClaimRate(List<DonorReward> rewards) {
        // Calculate the claim rate as a percentage
        long totalAvailable = rewards.stream()
                .mapToLong(reward -> reward.getAvailableQuantity() == null ? 0 : reward.getAvailableQuantity())
                .sum();

        long totalClaimed = rewards.stream()
                .mapToLong(reward -> reward.getClaimedQuantity() == null ? 0 : reward.getClaimedQuantity())
                .sum();

        return totalAvailable > 0 ? (double) totalClaimed / totalAvailable * 100 : 0;
    }

    private List<RewardPerformanceDTO> getTopPerformingRewards() {
        // Implement logic to calculate top performing rewards
        // This is a placeholder implementation
        List<RewardPerformanceDTO> topRewards = new ArrayList<>();

        // You would typically query your database for this information
        // or calculate it based on available data

        // Example of a hardcoded result:
        topRewards.add(RewardPerformanceDTO.builder()
                .rewardId(1L)
                .rewardTitle("Premium Supporter Badge")
                .claimCount(150L)
                .totalDonationAmount(BigDecimal.valueOf(7500))
                .conversionRate(85.5)
                .build());

        // Add more example rewards...

        return topRewards;
    }

    private Map<String, Long> getRewardsByStatus() {
        // Implement logic to count rewards by status
        // This is a placeholder implementation
        Map<String, Long> statusCounts = new HashMap<>();

        // Example hardcoded result:
        statusCounts.put("AVAILABLE", 45L);
        statusCounts.put("CLAIMED", 32L);
        statusCounts.put("EXPIRED", 12L);

        return statusCounts;
    }

    private Map<String, Long> getRewardsByTier() {
        // Implement logic to count rewards by tier
        // This is a placeholder implementation
        Map<String, Long> tierCounts = new HashMap<>();

        // Example hardcoded result:
        tierCounts.put("BRONZE", 25L);
        tierCounts.put("SILVER", 18L);
        tierCounts.put("GOLD", 10L);
        tierCounts.put("PLATINUM", 5L);

        return tierCounts;
    }
}
