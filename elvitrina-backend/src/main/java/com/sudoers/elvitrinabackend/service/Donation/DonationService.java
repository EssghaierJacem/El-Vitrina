package com.sudoers.elvitrinabackend.service.Donation;

import com.sudoers.elvitrinabackend.model.dto.request.DonationRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import com.sudoers.elvitrinabackend.model.dto.response.*;

public interface DonationService {
    DonationResponseDTO saveDonation(DonationRequestDTO requestDTO);
    List<DonationResponseDTO> getAllDonations();
    DonationResponseDTO getDonationById(Long id);
    void deleteDonation(Long id);
    DonationResponseDTO updateDonation(Long id, DonationRequestDTO requestDTO);
    Page<DonationResponseDTO> getDonationsPaginated(Pageable pageable);
    List<DonationResponseDTO> getDonationsByCampaignId(Long campaignId);
    DonationAnalyticsResponseDTO getDonationAnalytics();
    List<TopDonorResponseDTO> getTopDonors(Long campaignId, String timePeriod);
    StoreDonationInsightsDTO getStoreDonationInsights(Long storeId);
    List<DonationReceiptDTO> getStoreDonationReceipts(Long storeId);
    List<DonationHistoryDTO> getDonationHistory(Long userId, Long campaignId, String startDate, String endDate);
}
