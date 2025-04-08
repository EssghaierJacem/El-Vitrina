package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.Data;

@Data
public class GiftResponseDTO {
    private Long giftId;
    private String name;
    private String description;
    private String imageUrl;
    private Boolean won;
    private Long donationId;
    private Long rewardId;
    private Long userId;
}
