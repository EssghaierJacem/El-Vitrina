package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonorRewardResponseDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal minimumDonationAmount;
    private Integer availableQuantity;
    private Integer claimedQuantity;
    private String imageUrl;
    private Long campaignId;
    private String campaignTitle;
    private Boolean isAvailable;
}