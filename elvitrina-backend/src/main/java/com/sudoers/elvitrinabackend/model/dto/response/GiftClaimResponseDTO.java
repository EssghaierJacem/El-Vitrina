package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.Data;

@Data
public class GiftClaimResponseDTO {
    private GiftResponseDTO gift;
    private byte[] qrCode;
    private String giftCode;
}

