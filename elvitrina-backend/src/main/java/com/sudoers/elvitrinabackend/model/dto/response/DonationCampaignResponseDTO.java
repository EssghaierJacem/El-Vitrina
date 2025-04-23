package com.sudoers.elvitrinabackend.model.dto.response;

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
public class DonationCampaignResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String cause;
    private String imageUrl;
    private BigDecimal goalAmount;
    private BigDecimal currentAmount;
    private double progressPercentage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private boolean featured;
    private boolean verified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int donorCount;
    private Long storeId;
    private String storeName;
    private Long userId;
    private String userName;
    private List<DonorRewardResponseDTO> rewards;

}