package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardTierResponseDTO {
    private Long rewardId;
    private String name;
    private String description;
    private BigDecimal minimumDonationThreshold;
    private String benefitsList;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
