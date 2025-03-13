package com.sudoers.elvitrinabackend.service.offer;

import com.sudoers.elvitrinabackend.model.dto.OfferDTO;

import java.util.List;

public interface IOffer {
    List<OfferDTO> getAllOffers();
    OfferDTO getOfferById(Long id);
    OfferDTO createOffer(OfferDTO dto);
    OfferDTO updateOffer(Long id, OfferDTO dto);
    void deleteOffer(Long id);
}
