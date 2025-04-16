package com.sudoers.elvitrinabackend.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardFulfillmentRequestDTO {
    private String fulfillmentStatus;
    private String trackingNumber;
    private String fulfillmentNotes;
    private LocalDateTime fulfillmentDate;
}
