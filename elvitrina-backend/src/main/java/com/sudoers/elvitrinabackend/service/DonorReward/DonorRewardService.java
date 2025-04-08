package com.sudoers.elvitrinabackend.service.DonorReward;


import com.sudoers.elvitrinabackend.model.dto.request.DonorRewardRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.RewardFulfillmentRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.RewardTierRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonorRewardResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.RewardAnalyticsResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.RewardTierResponseDTO;

import java.util.List;

public interface DonorRewardService {
    DonorRewardResponseDTO saveDonorReward(DonorRewardRequestDTO dto);
    DonorRewardResponseDTO getDonorRewardById(Long id);
    void deleteDonorReward(Long id);
    DonorRewardResponseDTO updateDonorReward(Long id, DonorRewardRequestDTO dto);
    List<DonorRewardResponseDTO> getAllRewards();

    // Add these methods to your DonorRewardService interface
    RewardAnalyticsResponseDTO getRewardAnalytics();
    List<DonorRewardResponseDTO> getRewardsByStoreId(Long storeId);
    DonorRewardResponseDTO updateRewardFulfillment(Long id, RewardFulfillmentRequestDTO dto);

}
