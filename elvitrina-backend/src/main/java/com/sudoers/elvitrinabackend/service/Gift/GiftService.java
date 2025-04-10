package com.sudoers.elvitrinabackend.service.Gift;

import com.sudoers.elvitrinabackend.model.dto.request.GiftRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.GiftClaimResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.GiftResponseDTO;

import java.util.List;

public interface GiftService {
    GiftResponseDTO createGift(GiftRequestDTO dto);
    GiftResponseDTO getGiftById(Long id);
    List<GiftResponseDTO> getAllGifts();
    void deleteGift(Long id);
    List<GiftResponseDTO> getAvailableGiftsForUser(Long userId);
    GiftClaimResponseDTO claimGift(Long giftId, Long donationId, Long userId);
    byte[] generateGiftQRCode(String giftCode);

    void redeemGift(Long giftId, Long userId);
    void toggleGiftShared(Long giftId, Long userId);
}