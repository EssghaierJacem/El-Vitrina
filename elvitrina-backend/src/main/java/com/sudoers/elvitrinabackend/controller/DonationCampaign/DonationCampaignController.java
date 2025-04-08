package com.sudoers.elvitrinabackend.controller.DonationCampaign;

import com.sudoers.elvitrinabackend.model.dto.request.DonationCampaignRequestDTO;
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
}
