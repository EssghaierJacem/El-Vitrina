package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.GiftRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.GiftResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.Donation;
import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import com.sudoers.elvitrinabackend.model.entity.Gift;
import com.sudoers.elvitrinabackend.model.entity.User;
import org.springframework.stereotype.Component;

@Component
public class GiftMapper {

    public Gift toEntity(GiftRequestDTO dto, Donation donation, DonorReward reward, User user) {
        return Gift.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .isRedeemed(dto.getIsRedeemed() != null ? dto.getIsRedeemed() : false)
                .donation(donation)
                .donorReward(reward)
                .user(user)
                .build();
    }

    public GiftResponseDTO toDto(Gift gift) {
        GiftResponseDTO dto = new GiftResponseDTO();
        dto.setGiftId(gift.getGiftId());
        dto.setName(gift.getName());
        dto.setDescription(gift.getDescription());
        dto.setImageUrl(gift.getImageUrl());
        dto.setDonationId(gift.getDonation() != null ? gift.getDonation().getDonationId() : null);
        dto.setRewardId(gift.getDonorReward() != null ? gift.getDonorReward().getRewardId() : null);
        dto.setUserId(gift.getUser() != null ? gift.getUser().getId() : null);
        dto.setIsRedeemed(gift.getIsRedeemed());
        dto.setGiftCode(gift.getGiftCode());
        return dto;
    }
}
