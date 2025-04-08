package com.sudoers.elvitrinabackend.controller.DonationCampaign;

import com.sudoers.elvitrinabackend.model.dto.request.CampaignExtensionRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.CampaignStatusRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.DonationCampaignRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.CampaignAnalyticsResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.CampaignProgressResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.CampaignReportResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationCampaignResponseDTO;
import com.sudoers.elvitrinabackend.service.DonationCampaign.DonationCampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class DonationCampaignController {

    private final DonationCampaignService donationCampaignService;

    @Autowired
    public DonationCampaignController(DonationCampaignService donationCampaignService) {
        this.donationCampaignService = donationCampaignService;
    }

    @PostMapping
    public ResponseEntity<DonationCampaignResponseDTO> createCampaign(@RequestBody DonationCampaignRequestDTO requestDTO) {
        DonationCampaignResponseDTO savedCampaign = donationCampaignService.save(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCampaign);
    }

    @GetMapping
    public ResponseEntity<List<DonationCampaignResponseDTO>> getAllCampaigns() {
        List<DonationCampaignResponseDTO> campaigns = donationCampaignService.getAll();
        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationCampaignResponseDTO> getCampaignById(@PathVariable Long id) {
        DonationCampaignResponseDTO campaign = donationCampaignService.getById(id);
        return ResponseEntity.ok(campaign);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonationCampaignResponseDTO> updateCampaign(@PathVariable Long id, @RequestBody DonationCampaignRequestDTO requestDTO) {
        DonationCampaignResponseDTO updatedCampaign = donationCampaignService.update(id, requestDTO);
        return ResponseEntity.ok(updatedCampaign);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        donationCampaignService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<DonationCampaignResponseDTO>> getCampaignsPaginated(Pageable pageable) {
        Page<DonationCampaignResponseDTO> campaigns = donationCampaignService.getPaginated(pageable);
        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/active")
    public ResponseEntity<List<DonationCampaignResponseDTO>> getActiveCampaigns() {
        List<DonationCampaignResponseDTO> campaigns = donationCampaignService.getActive();
        return ResponseEntity.ok(campaigns);
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<DonationCampaignResponseDTO> updateCampaignStatus(
            @PathVariable Long id,
            @RequestBody CampaignStatusRequestDTO statusRequest) {
        DonationCampaignResponseDTO updatedCampaign = donationCampaignService.updateStatus(id, statusRequest);
        return ResponseEntity.ok(updatedCampaign);
    }

    @GetMapping("/analytics")
    public ResponseEntity<CampaignAnalyticsResponseDTO> getCampaignAnalytics() {
        CampaignAnalyticsResponseDTO analytics = donationCampaignService.getPlatformAnalytics();
        return ResponseEntity.ok(analytics);
    }

    // STORE OWNER/SELLER FUNCTIONS

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<DonationCampaignResponseDTO>> getStoreCampaigns(@PathVariable Long storeId) {
        List<DonationCampaignResponseDTO> campaigns = donationCampaignService.getCampaignsByStore(storeId);
        return ResponseEntity.ok(campaigns);
    }

    @PatchMapping("/{id}/extend")
    public ResponseEntity<DonationCampaignResponseDTO> extendCampaign(
            @PathVariable Long id,
            @RequestBody CampaignExtensionRequestDTO extensionRequest) {
        DonationCampaignResponseDTO extendedCampaign = donationCampaignService.extendCampaign(id, extensionRequest);
        return ResponseEntity.ok(extendedCampaign);
    }

    @GetMapping("/store/{storeId}/reports")
    public ResponseEntity<CampaignReportResponseDTO> getStoreCampaignReports(@PathVariable Long storeId) {
        CampaignReportResponseDTO report = donationCampaignService.getStoreCampaignReport(storeId);
        return ResponseEntity.ok(report);
    }

    // REGULAR USER FUNCTIONS

    @GetMapping("/filter")
    public ResponseEntity<Page<DonationCampaignResponseDTO>> filterCampaigns(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String cause,
            @RequestParam(required = false) Double minGoal,
            @RequestParam(required = false) Double maxGoal,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sortBy,
            Pageable pageable) {
        Page<DonationCampaignResponseDTO> filteredCampaigns = donationCampaignService.filterCampaigns(
                title, cause, minGoal, maxGoal, status, sortBy, pageable);
        return ResponseEntity.ok(filteredCampaigns);
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<CampaignProgressResponseDTO> getCampaignProgress(@PathVariable Long id) {
        CampaignProgressResponseDTO progress = donationCampaignService.getCampaignProgress(id);
        return ResponseEntity.ok(progress);
    }


}
