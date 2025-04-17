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
public class DonationResponseDTO {
    private Long donationId;
    private BigDecimal amount;
    private String message;
    private Long campaignId;
    private String campaignTitle;
    private Long userId;
    private String donorName;
    private Long storeId;
    private LocalDateTime donationDate;
    private String status;
    private Long giftId;

}
