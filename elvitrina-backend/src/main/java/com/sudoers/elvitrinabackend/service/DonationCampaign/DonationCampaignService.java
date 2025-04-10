package com.sudoers.elvitrinabackend.service.DonationCampaign;

import com.sudoers.elvitrinabackend.model.dto.request.CampaignExtensionRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.CampaignStatusRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.DonationCampaignRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.CampaignAnalyticsResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.CampaignProgressResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.CampaignReportResponseDTO;
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
    // New methods for Admin functions
    DonationCampaignResponseDTO updateStatus(Long id, CampaignStatusRequestDTO statusRequest);
    CampaignAnalyticsResponseDTO getPlatformAnalytics();

    // Store owner/seller functions
    List<DonationCampaignResponseDTO> getCampaignsByStore(Long storeId);
    DonationCampaignResponseDTO extendCampaign(Long id, CampaignExtensionRequestDTO extensionRequest);
    CampaignReportResponseDTO getStoreCampaignReport(Long storeId);

    // Regular user functions
    Page<DonationCampaignResponseDTO> filterCampaigns(
            String title, String cause, Double minGoal, Double maxGoal,
            String status, String sortBy, Pageable pageable);
    CampaignProgressResponseDTO getCampaignProgress(Long id);

}
