package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GiftResponseDTO {
    private Long giftId;
    private String name;
    private String description;
    private String imageUrl;
    private Long donationId;
    private Long rewardId;
    private Long userId;
    private Boolean isRedeemed;
    private  Long discount;
    private String giftCode;
    private Boolean isshared;
    private LocalDateTime expirationDate;
}

