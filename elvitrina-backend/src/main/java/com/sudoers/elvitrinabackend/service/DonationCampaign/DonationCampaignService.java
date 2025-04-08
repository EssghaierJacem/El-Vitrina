package com.sudoers.elvitrinabackend.service.DonationCampaign;

import com.sudoers.elvitrinabackend.model.dto.request.DonationCampaignRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationCampaignResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DonationCampaignService {
    DonationCampaignResponseDTO save(DonationCampaignRequestDTO requestDTO);
    List<DonationCampaignResponseDTO> getAll();
    DonationCampaignResponseDTO getById(Long id);
    void delete(Long id);
    DonationCampaignResponseDTO update(Long id, DonationCampaignRequestDTO requestDTO);
    Page<DonationCampaignResponseDTO> getPaginated(Pageable pageable);
    List<DonationCampaignResponseDTO> getActive();
}
