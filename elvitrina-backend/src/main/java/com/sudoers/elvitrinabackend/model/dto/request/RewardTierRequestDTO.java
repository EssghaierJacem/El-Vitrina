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
public class RewardTierRequestDTO {
    private String name;
    private String description;
    private BigDecimal minimumDonationThreshold;
    private String benefitsList;
    private Boolean isActive;
}