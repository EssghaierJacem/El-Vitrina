package com.sudoers.elvitrinabackend.service.Gift;

import com.sudoers.elvitrinabackend.model.dto.request.GiftRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.GiftResponseDTO;

import java.util.List;

public interface GiftService {
    GiftResponseDTO createGift(GiftRequestDTO dto);
    GiftResponseDTO getGiftById(Long id);
    List<GiftResponseDTO> getAllGifts();
    void deleteGift(Long id);
}