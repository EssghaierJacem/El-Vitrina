package com.sudoers.elvitrinabackend.service.DonorReward;


import com.sudoers.elvitrinabackend.model.dto.request.DonorRewardRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonorRewardResponseDTO;

import java.util.List;

public interface DonorRewardService {
    DonorRewardResponseDTO saveDonorReward(DonorRewardRequestDTO dto);
    DonorRewardResponseDTO getDonorRewardById(Long id);
    void deleteDonorReward(Long id);
    DonorRewardResponseDTO updateDonorReward(Long id, DonorRewardRequestDTO dto);
    List<DonorRewardResponseDTO> getAllRewards();
}
