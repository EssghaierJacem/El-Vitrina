package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignAnalyticsResponseDTO {
    private long totalCampaigns;
    private double totalRaised;
    private double averageGoalAmount;
    private long successfulCampaigns;
    private double successRate;
    private Map<String, Long> campaignsByCause;
    private double averageDonationAmount;
}