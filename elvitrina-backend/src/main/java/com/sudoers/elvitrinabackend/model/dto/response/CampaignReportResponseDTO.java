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
public class CampaignReportResponseDTO {
    private Long storeId;
    private int totalCampaigns;
    private double totalRaised;
    private long donorCount;
    private long completedCampaigns;
    private long activeCampaigns;
    private double roi;
    private Map<String, Double> monthlyPerformance;
}