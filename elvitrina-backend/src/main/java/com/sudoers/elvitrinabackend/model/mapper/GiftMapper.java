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
                .donation(donation)
                .donorReward(reward)
                .user(user)
                .discount(dto.getDiscount() != null ? dto.getDiscount() : 0L) // Default to 0 if null
                .giftCode(dto.getGiftCode())
                .expirationDate(dto.getExpirationDate()) // Map expiration date
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
        dto.setDiscount(gift.getDiscount() != null ? gift.getDiscount() : 0L); // Map discount
        dto.setGiftCode(gift.getGiftCode());
        dto.setIsshared(gift.getIsshared() != null ? gift.getIsshared() : false); // Map isShared with default
        dto.setExpirationDate(gift.getExpirationDate()); // Map expiration date
        return dto;
    }
}