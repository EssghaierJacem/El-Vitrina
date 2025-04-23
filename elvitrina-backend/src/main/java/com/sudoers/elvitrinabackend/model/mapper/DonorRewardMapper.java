package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.DonorRewardRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonorRewardResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DonorRewardMapper {

    public DonorReward toEntity(DonorRewardRequestDTO dto) {
        return DonorReward.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .minimumDonationAmount(dto.getMinimumDonationAmount() != null ?
                        dto.getMinimumDonationAmount().doubleValue() : null)
                .availableQuantity(dto.getAvailableQuantity())
                .redemptionCode(dto.getRedemptionCode())
                .build();
    }

    public DonorRewardResponseDTO toResponseDTO(DonorReward reward) {
        return DonorRewardResponseDTO.builder()
                .rewardId(reward.getRewardId())
                .title(reward.getTitle())
                .description(reward.getDescription())
                .minimumDonationAmount(reward.getMinimumDonationAmount() != null ?
                        BigDecimal.valueOf(reward.getMinimumDonationAmount()) : null)
                .availableQuantity(reward.getAvailableQuantity())
                .claimedQuantity(reward.getClaimedQuantity())
                .imageUrl(reward.getImageUrl())
                .redemptionCode(reward.getRedemptionCode())
                .campaignId(reward.getCampaign() != null ? reward.getCampaign().getCampaignId() : null)
                .campaignTitle(reward.getCampaign() != null ? reward.getCampaign().getTitle() : null)
                .build();
    }
}
