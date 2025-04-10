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
public class RewardPerformanceDTO {
    private Long rewardId;
    private String rewardTitle;
    private Long claimCount;
    private BigDecimal totalDonationAmount;
    private Double conversionRate;
}