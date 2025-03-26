package com.sudoers.elvitrinabackend.controller.DonationCampaign;


import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;
import com.sudoers.elvitrinabackend.service.DonationCampaign.DonationCampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class DonationCampaignController {

    @Autowired
    private DonationCampaignService donationCampaignService;

    @PostMapping
    public ResponseEntity<DonationCampaign> createCampaign(@RequestBody DonationCampaign campaign) {
        DonationCampaign savedCampaign = donationCampaignService.saveDonationCampaign(campaign);
        return ResponseEntity.ok(savedCampaign);
    }

    @GetMapping
    public ResponseEntity<List<DonationCampaign>> getAllCampaigns() {
        List<DonationCampaign> campaigns = donationCampaignService.getAllDonationCampaigns();
        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationCampaign> getCampaignById(@PathVariable Long id) {
        DonationCampaign campaign = donationCampaignService.getDonationCampaignById(id);
        return ResponseEntity.ok(campaign);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonationCampaign> updateCampaign(@PathVariable Long id, @RequestBody DonationCampaign campaign) {
        DonationCampaign updatedCampaign = donationCampaignService.updateDonationCampaign(id, campaign);
        return ResponseEntity.ok(updatedCampaign);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        donationCampaignService.deleteDonationCampaign(id);
        return ResponseEntity.noContent().build();
    }


}