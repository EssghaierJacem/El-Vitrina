package com.sudoers.elvitrinabackend.model.dto.request;

import lombok.Data;

@Data
public class GiftRequestDTO {
    private String name;
    private String description;
    private String imageUrl;
    private Long donationId;
    private Long rewardId;
    private Long userId;
    private Boolean isRedeemed;
}
