package com.sudoers.elvitrinabackend.service.DonorReward;


import com.sudoers.elvitrinabackend.model.entity.DonorReward;

public interface DonorRewardService {
    DonorReward saveDonorReward(DonorReward donorReward);
    DonorReward getDonorRewardById(Long id);
    void deleteDonorReward(Long id);
    DonorReward updateDonorReward(Long id, DonorReward donorReward);

}