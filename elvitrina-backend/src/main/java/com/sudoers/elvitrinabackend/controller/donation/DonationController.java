package com.sudoers.elvitrinabackend.controller.donation;

import com.sudoers.elvitrinabackend.model.dto.request.DonationRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationResponseDTO;
import com.sudoers.elvitrinabackend.service.Donation.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    @Autowired
    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    public ResponseEntity<DonationResponseDTO> createDonation(@RequestBody DonationRequestDTO requestDTO) {
        DonationResponseDTO savedDonation = donationService.saveDonation(requestDTO);
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
}