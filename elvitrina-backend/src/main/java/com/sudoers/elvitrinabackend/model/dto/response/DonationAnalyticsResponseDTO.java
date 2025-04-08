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
public class DonationAnalyticsResponseDTO {
    private BigDecimal totalDonationAmount;
    private Long totalDonationCount;
    private Long anonymousDonationCount;
    private BigDecimal averageDonationAmount;
    private Long uniqueDonorCount;
    private Map<String, BigDecimal> donationTrendsByMonth; // Month -> Amount
}
