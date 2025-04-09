package com.sudoers.elvitrinabackend.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonorRewardRequestDTO {
    private String title;
    private String description;
    private BigDecimal minimumDonationAmount;
    private Integer availableQuantity;
    private String imageUrl;
    private Long campaignId;
}