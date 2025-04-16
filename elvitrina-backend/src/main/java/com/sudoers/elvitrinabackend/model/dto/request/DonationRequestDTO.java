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
    private BigDecimal amount;
    private String message;
    private Long campaignId;
    private Long userId;
    private Boolean isAnonymous;
}
