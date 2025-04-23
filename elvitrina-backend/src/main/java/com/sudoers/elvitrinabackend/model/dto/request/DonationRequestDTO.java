package com.sudoers.elvitrinabackend.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationRequestDTO {
    private double amount;
    private String donorMessage;
    private Long donationCampaignId;
    private Long userId;
    private Long storeId;
}
