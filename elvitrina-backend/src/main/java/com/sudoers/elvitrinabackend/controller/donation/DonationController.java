package com.sudoers.elvitrinabackend.controller.donation;

import com.sudoers.elvitrinabackend.model.dto.request.DonationRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationResponseDTO;
import com.sudoers.elvitrinabackend.service.Donation.DonationService;
import com.sudoers.elvitrinabackend.service.DonationCampaign.DonationCampaignServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sudoers.elvitrinabackend.model.dto.response.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    private final DonationCampaignServiceImpl donationCampaignServiceImp;

    @Autowired
    public DonationController(DonationService donationService ,DonationCampaignServiceImpl donationCampaignServiceImp ) {
        this.donationService = donationService;
        this.donationCampaignServiceImp = donationCampaignServiceImp;
    }

    @PostMapping
    public ResponseEntity<DonationResponseDTO> createDonation(@RequestBody DonationRequestDTO requestDTO) {
        System.out.println(requestDTO);
        DonationResponseDTO savedDonation = donationService.saveDonation(requestDTO);
        donationCampaignServiceImp.updateAmount(savedDonation.getCampaignId(),savedDonation.getAmount().doubleValue());
        System.out.println("testt" + savedDonation);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDonation);
    }

    @GetMapping
    public ResponseEntity<List<DonationResponseDTO>> getAllDonations() {
        List<DonationResponseDTO> donations = donationService.getAllDonations();
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationResponseDTO> getDonationById(@PathVariable Long id) {
        DonationResponseDTO donation = donationService.getDonationById(id);
        return ResponseEntity.ok(donation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonationResponseDTO> updateDonation(@PathVariable Long id, @RequestBody DonationRequestDTO requestDTO) {
        DonationResponseDTO updatedDonation = donationService.updateDonation(id, requestDTO);
        return ResponseEntity.ok(updatedDonation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable Long id) {
        donationService.deleteDonation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<DonationResponseDTO>> getDonationsPaginated(Pageable pageable) {
        Page<DonationResponseDTO> donations = donationService.getDonationsPaginated(pageable);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<DonationResponseDTO>> getDonationsByCampaignId(@PathVariable Long campaignId) {
        List<DonationResponseDTO> donations = donationService.getDonationsByCampaignId(campaignId);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/analytics")
    public ResponseEntity<DonationAnalyticsResponseDTO> getDonationAnalytics() {
        return ResponseEntity.ok(donationService.getDonationAnalytics());
    }

    @GetMapping("/top-donors")
    public ResponseEntity<List<TopDonorResponseDTO>> getTopDonors(
            @RequestParam(required = false) Long campaignId,
            @RequestParam(required = false) String timePeriod) {
        return ResponseEntity.ok(donationService.getTopDonors(campaignId, timePeriod));
    }

    // Store Owner/Seller Functions
    @GetMapping("/store/{storeId}")
    public ResponseEntity<StoreDonationInsightsDTO> getStoreDonationInsights(@PathVariable Long storeId) {
        return ResponseEntity.ok(donationService.getStoreDonationInsights(storeId));
    }

    @GetMapping("/store/{storeId}/receipts")
    public ResponseEntity<List<DonationReceiptDTO>> getStoreDonationReceipts(@PathVariable Long storeId) {
        return ResponseEntity.ok(donationService.getStoreDonationReceipts(storeId));
    }

    // Regular User Functions
    @GetMapping("/history")
    public ResponseEntity<List<DonationHistoryDTO>> getDonationHistory(
            @RequestParam Long userId,
            @RequestParam(required = false) Long campaignId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(donationService.getDonationHistory(userId, campaignId, startDate, endDate));
    }
}