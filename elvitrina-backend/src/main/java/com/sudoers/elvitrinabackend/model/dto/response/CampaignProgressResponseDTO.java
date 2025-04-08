package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignProgressResponseDTO {
    private Long campaignId;
    private String title;
    private double currentAmount;
    private double goalAmount;
    private double progressPercentage;
    private long daysRemaining;
    private int donorCount;
    private double dailyAverageDonation;
    private double projectedEndAmount;
    private boolean onTrackToReachGoal;
    private List<Map<String, Object>> recentDonations;
}