package com.sudoers.elvitrinabackend.controller.DonorReward;


import com.sudoers.elvitrinabackend.model.entity.DonorReward;
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
    public ResponseEntity<DonorReward> createReward(@RequestBody DonorReward reward) {
        DonorReward savedReward = donorRewardService.saveDonorReward(reward);
        return ResponseEntity.ok(savedReward);
    }



    @GetMapping("/{id}")
    public ResponseEntity<DonorReward> getRewardById(@PathVariable Long id) {
        DonorReward reward = donorRewardService.getDonorRewardById(id);
        return ResponseEntity.ok(reward);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonorReward> updateReward(@PathVariable Long id, @RequestBody DonorReward reward) {
        DonorReward updatedReward = donorRewardService.updateDonorReward(id, reward);
        return ResponseEntity.ok(updatedReward);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReward(@PathVariable Long id) {
        donorRewardService.deleteDonorReward(id);
        return ResponseEntity.noContent().build();
    }


}
