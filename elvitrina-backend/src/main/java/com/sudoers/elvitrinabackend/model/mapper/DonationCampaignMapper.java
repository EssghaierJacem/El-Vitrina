package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.DonationCampaignRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationCampaignResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
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
            campaign.setGoal(dto.getGoalAmount());



            campaign.setCurrentAmount(dto.getCurrentAmount());


        campaign.setStartDate(dto.getStartDate());
        campaign.setEndDate(dto.getEndDate());




        return campaign;
    }

    public DonationCampaignResponseDTO toResponseDTO(DonationCampaign campaign) {
        DonationCampaignResponseDTO.DonationCampaignResponseDTOBuilder builder = DonationCampaignResponseDTO.builder()
                .id(campaign.getCampaignId())
                .title(campaign.getTitle())
                .description(campaign.getDescription())
                .imageUrl(campaign.getImageUrl())
                .cause(campaign.getCause())
                .goalAmount(BigDecimal.valueOf(campaign.getGoal()))
                .currentAmount(BigDecimal.valueOf(campaign.getCurrentAmount()))
                .progressPercentage(campaign.getProgressPercentage())
                .startDate(campaign.getStartDate())
                .endDate(campaign.getEndDate())
                .status(campaign.getStatus())
                .featured(campaign.isFeatured())
                .verified(campaign.isVerified())
                .createdAt(campaign.getCreatedAt())
                .updatedAt(campaign.getUpdatedAt())
                .donorCount(campaign.getDonations() != null ? campaign.getDonations().size() : 0)
                .rewards(campaign.getRewards() != null ?
                        campaign.getRewards().stream()
                                .map(donorRewardMapper::toResponseDTO)
                                .collect(Collectors.toList()) :
                        Collections.emptyList());

        // Set store info if available
        if (campaign.getStore() != null) {
            builder.storeId(campaign.getStore().getStoreId());
            builder.storeName(campaign.getStore().getStoreName());
        }

        // Set user info if available
        if (campaign.getUser() != null) {
            builder.userId(campaign.getUser().getId());
            builder.userName(campaign.getUser().getUsername());
        }

        return builder.build();
    }

    public void updateEntity(DonationCampaignRequestDTO dto, DonationCampaign campaign) {
        Optional.ofNullable(dto.getTitle()).ifPresent(campaign::setTitle);
        Optional.ofNullable(dto.getDescription()).ifPresent(campaign::setDescription);
        Optional.ofNullable(dto.getGoalAmount()).ifPresent(goal -> campaign.setGoal(goal.doubleValue()));
        Optional.ofNullable(dto.getCurrentAmount()).ifPresent(amount -> campaign.setCurrentAmount(amount.doubleValue()));
        Optional.ofNullable(dto.getStartDate()).ifPresent(campaign::setStartDate);
        Optional.ofNullable(dto.getEndDate()).ifPresent(campaign::setEndDate);

    }
}