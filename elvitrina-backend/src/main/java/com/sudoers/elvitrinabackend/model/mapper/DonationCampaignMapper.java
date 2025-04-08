package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.DonationCampaignRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.DonorRewardRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationCampaignResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonorRewardResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;
import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Component
@RequiredArgsConstructor
public class DonationCampaignMapper {

    private final DonorRewardMapper donorRewardMapper;

    public DonationCampaign toEntity(DonationCampaignRequestDTO dto) {
        DonationCampaign campaign = new DonationCampaign();
        campaign.setTitle(dto.getTitle());
        campaign.setDescription(dto.getDescription());

        // Convert BigDecimal to double if necessary for the entity
        if (dto.getGoalAmount() != null) {
            campaign.setGoal(dto.getGoalAmount().doubleValue());
        }

        if (dto.getCurrentAmount() != null) {
            campaign.setCurrentAmount(dto.getCurrentAmount().doubleValue());
        }

        campaign.setStartDate(dto.getStartDate());
        campaign.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) {
            campaign.setStatus(dto.getStatus());
        }

        return campaign;
    }

    public DonationCampaignResponseDTO toResponseDTO(DonationCampaign campaign) {
        return DonationCampaignResponseDTO.builder()
                .id(campaign.getCampaignId())
                .title(campaign.getTitle())
                .description(campaign.getDescription())

                .goalAmount(BigDecimal.valueOf(campaign.getGoal()))
                .currentAmount(BigDecimal.valueOf(campaign.getCurrentAmount()))
                .progressPercentage(campaign.getProgressPercentage())
                .startDate(campaign.getStartDate())
                .endDate(campaign.getEndDate())
                .status(campaign.getStatus())
                .createdAt(campaign.getCreatedAt())
                .donorCount(campaign.getDonations() != null ? campaign.getDonations().size() : 0)
                .rewards(campaign.getRewards() != null ?
                        campaign.getRewards().stream()
                                .map(donorRewardMapper::toResponseDTO)
                                .collect(Collectors.toList()) :
                        Collections.emptyList())
                .build();
    }

    public void updateEntity(DonationCampaignRequestDTO dto, DonationCampaign campaign) {
        Optional.ofNullable(dto.getTitle()).ifPresent(campaign::setTitle);
        Optional.ofNullable(dto.getDescription()).ifPresent(campaign::setDescription);
        Optional.ofNullable(dto.getGoalAmount()).ifPresent(goal -> campaign.setGoal(goal.doubleValue()));
        Optional.ofNullable(dto.getCurrentAmount()).ifPresent(amount -> campaign.setCurrentAmount(amount.doubleValue()));
        Optional.ofNullable(dto.getStartDate()).ifPresent(campaign::setStartDate);
        Optional.ofNullable(dto.getEndDate()).ifPresent(campaign::setEndDate);
        Optional.ofNullable(dto.getStatus()).ifPresent(campaign::setStatus);
    }
}
