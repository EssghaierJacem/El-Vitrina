package com.sudoers.elvitrinabackend.model.dto;

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
public class StoreStatsDTO {
    private Long storeId;
    private String storeName;
    private Integer productCount;
    private Integer feedbackCount;
    private Double averageRating;
    private Integer activeProductsCount;
    private Integer donationCampaignsCount;
    private Integer virtualEventsCount;
    private Integer advertisementsCount;
}