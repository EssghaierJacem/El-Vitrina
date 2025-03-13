package com.sudoers.elvitrinabackend.service.DonorReward;

import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import com.sudoers.elvitrinabackend.repository.DonorRewardRepository;
import com.sudoers.elvitrinabackend.service.DonorReward.DonorRewardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DonorRewardServiceImpl implements DonorRewardService {

    @Autowired
    private DonorRewardRepository donorRewardRepository;

    @Override
    public DonorReward saveDonorReward(DonorReward donorReward) {
        return donorRewardRepository.save(donorReward);
    }

    @Override
    public DonorReward getDonorRewardById(Long id) {
        Optional<DonorReward> donorReward = donorRewardRepository.findById(id);
        return donorReward.orElseThrow(() -> new RuntimeException("DonorReward not found"));
    }

    @Override
    public void deleteDonorReward(Long id) {
        donorRewardRepository.deleteById(id);
    }

    @Override
    public DonorReward updateDonorReward(Long id, DonorReward donorReward) {
        DonorReward existingReward = getDonorRewardById(id);
        existingReward.setType(donorReward.getType());
        existingReward.setDetails(donorReward.getDetails());
        existingReward.setIssuanceDate(donorReward.getIssuanceDate());
        existingReward.setExpirationDate(donorReward.getExpirationDate());
        existingReward.setRedemptionStatus(donorReward.getRedemptionStatus());
        existingReward.setRedemptionDate(donorReward.getRedemptionDate());
        existingReward.setRedemptionCode(donorReward.getRedemptionCode());
        existingReward.setTimestamp(donorReward.getTimestamp());
        existingReward.setDonation(donorReward.getDonation());
        return donorRewardRepository.save(existingReward);
    }


}