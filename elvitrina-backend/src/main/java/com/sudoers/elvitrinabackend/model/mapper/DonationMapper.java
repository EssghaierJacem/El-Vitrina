package com.sudoers.elvitrinabackend.model.mapper;

import com.sudoers.elvitrinabackend.model.dto.request.DonationRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.Donation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DonationMapper {

    public Donation toEntity(DonationRequestDTO dto) {
        if (dto == null) return null;

        Donation donation = new Donation();
        donation.setAmount(dto.getAmount());
        donation.setDonorMessage(dto.getDonorMessage());
        // campaign, gift, and user are handled in the service layer
        return donation;
    }

    public DonationResponseDTO toResponseDTO(Donation donation) {
        if (donation == null) return null;

        return DonationResponseDTO.builder()
                .donationId(donation.getDonationId())
                .amount(donation.getAmount() != null ? BigDecimal.valueOf(donation.getAmount()) : null)
                .message(donation.getDonorMessage())
                .campaignId(donation.getDonationCampaign() != null ? donation.getDonationCampaign().getCampaignId() : null)
                .campaignTitle(donation.getDonationCampaign() != null ? donation.getDonationCampaign().getTitle() : null)
                .userId(donation.getUser() != null ? donation.getUser().getId() : null)
                .donorName(donation.getUser() != null ? donation.getUser().getName() : null)
                .storeId(donation.getStore()!= null ? donation.getStore().getStoreId(): null)
                .donationDate(donation.getCreatedAt())
                .giftId(donation.getGift() != null ? donation.getGift().getGiftId() : null)
                .status(null)
                .build();
    }

    public void updateEntityFromDTO(DonationRequestDTO dto, Donation donation) {
        if (dto == null || donation == null) return;
            donation.setAmount(dto.getAmount());
        if (dto.getDonorMessage() != null)
            donation.setDonorMessage(dto.getDonorMessage());


    }
}

