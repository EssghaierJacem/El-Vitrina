// StoreDonationInsightsDTO.java
package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreDonationInsightsDTO {
    private Long storeId;
    private BigDecimal totalDonationAmount;
    private Long totalDonationCount;
    private BigDecimal averageDonationAmount;
    private Long uniqueDonorCount;
    private Map<String, BigDecimal> donationsByCampaign; // Campaign Name -> Amount
}