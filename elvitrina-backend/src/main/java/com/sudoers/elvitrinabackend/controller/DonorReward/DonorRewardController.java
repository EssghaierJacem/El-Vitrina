package com.sudoers.elvitrinabackend.controller.DonorReward;

import com.sudoers.elvitrinabackend.model.dto.request.DonorRewardRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.RewardFulfillmentRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.RewardTierRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonorRewardResponseDTO;
import com.sudoers.elvitrinabackend.service.DonorReward.DonorRewardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
public class DonorRewardController {

    @Autowired
    private DonorRewardService donorRewardService;

    @PostMapping
    public ResponseEntity<DonorRewardResponseDTO> createReward(@RequestBody DonorRewardRequestDTO dto) {
        return ResponseEntity.ok(donorRewardService.saveDonorReward(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonorRewardResponseDTO> getRewardById(@PathVariable Long id) {
        return ResponseEntity.ok(donorRewardService.getDonorRewardById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonorRewardResponseDTO> updateReward(
            @PathVariable Long id,
            @RequestBody DonorRewardRequestDTO dto) {
        return ResponseEntity.ok(donorRewardService.updateDonorReward(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReward(@PathVariable Long id) {
        donorRewardService.deleteDonorReward(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<DonorRewardResponseDTO>> getAllRewards() {
        return ResponseEntity.ok(donorRewardService.getAllRewards());
    }


    // Add these endpoints to your existing DonorRewardController class

    // Admin Functions

    @GetMapping("/analytics")
    public ResponseEntity<?> getRewardAnalytics() {
        return ResponseEntity.ok(donorRewardService.getRewardAnalytics());
    }

    // Store Owner/Seller Functions
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<DonorRewardResponseDTO>> getStoreRewards(@PathVariable Long storeId) {
        return ResponseEntity.ok(donorRewardService.getRewardsByStoreId(storeId));
    }

    @PatchMapping("/{id}/fulfillment")
    public ResponseEntity<DonorRewardResponseDTO> updateRewardFulfillment(
            @PathVariable Long id,
            @RequestBody RewardFulfillmentRequestDTO dto) {
        return ResponseEntity.ok(donorRewardService.updateRewardFulfillment(id, dto));
    }
}
