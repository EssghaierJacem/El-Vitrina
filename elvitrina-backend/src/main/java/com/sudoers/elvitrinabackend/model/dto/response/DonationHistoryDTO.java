// DonationHistoryDTO.java
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
public class DonationHistoryDTO {
    private Long donationId;
    private BigDecimal amount;
    private LocalDateTime donationDate;
    private Long campaignId;
    private String campaignTitle;
    private String message;
    private Boolean isAnonymous;
    private RewardInfoDTO rewardInfo;
}