package com.sudoers.elvitrinabackend.service.Donation;

import com.sudoers.elvitrinabackend.model.dto.request.DonationRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DonationService {
    DonationResponseDTO saveDonation(DonationRequestDTO requestDTO);
    List<DonationResponseDTO> getAllDonations();
    DonationResponseDTO getDonationById(Long id);
    void deleteDonation(Long id);
    DonationResponseDTO updateDonation(Long id, DonationRequestDTO requestDTO);
    Page<DonationResponseDTO> getDonationsPaginated(Pageable pageable);
    List<DonationResponseDTO> getDonationsByCampaignId(Long campaignId);
}
