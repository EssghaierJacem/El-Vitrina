package com.sudoers.elvitrinabackend.service.offer;

import com.sudoers.elvitrinabackend.model.dto.OfferDTO;
import com.sudoers.elvitrinabackend.model.entity.Offer;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.OfferRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfferService implements IOffer {

    private final OfferRepository offerRepository;
    private final UserRepository userRepository;

    private OfferDTO mapToDTO(Offer offer) {
        return new OfferDTO(
                offer.getId(),
                offer.getName(),
                offer.getDescription(),
                offer.getDiscount(),
                offer.getStartDate(),
                offer.getEndDate(),
                offer.getOffer(),
                offer.getUser() != null ? offer.getUser().getId() : null
        );
    }

    private Offer mapToEntity(OfferDTO dto) {
        User user = null;
        if (dto.getUserId() != null) {
            user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        return new Offer(
                dto.getId(),
                dto.getName(),
                dto.getDescription(),
                dto.getDiscount(),
                dto.getStartDate(),
                dto.getEndDate(),
                dto.getOffer(),
                user
        );
    }

    public List<OfferDTO> getAllOffers() {
        return offerRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public OfferDTO getOfferById(Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
        return mapToDTO(offer);
    }

    public OfferDTO createOffer(OfferDTO dto) {
        Offer offer = mapToEntity(dto);
        Offer savedOffer = offerRepository.save(offer);
        return mapToDTO(savedOffer);
    }

    public OfferDTO updateOffer(Long id, OfferDTO dto) {
        Offer existingOffer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        existingOffer.setName(dto.getName());
        existingOffer.setDescription(dto.getDescription());
        existingOffer.setDiscount(dto.getDiscount());
        existingOffer.setStartDate(dto.getStartDate());
        existingOffer.setEndDate(dto.getEndDate());
        existingOffer.setOffer(dto.getOffer());

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            existingOffer.setUser(user);
        } else {
            existingOffer.setUser(null);
        }

        Offer updatedOffer = offerRepository.save(existingOffer);
        return mapToDTO(updatedOffer);
    }

    public void deleteOffer(Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
        offerRepository.delete(offer);
    }
}
