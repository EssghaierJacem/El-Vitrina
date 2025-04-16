// DonationReceiptDTO.java
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
public class DonationReceiptDTO {
    private Long donationId;
    private BigDecimal amount;
    private LocalDateTime donationDate;
    private String campaignTitle;
    private String donorName;
    private String donorEmail;
    private String message;
    private String receiptNumber;
}
