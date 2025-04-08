package com.sudoers.elvitrinabackend.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationCampaignRequestDTO {
    private String title;
    private String description;
    private BigDecimal goalAmount;
    private BigDecimal currentAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Long userId;
    private Long storeId;
    private List<DonorRewardRequestDTO> rewards;
}

