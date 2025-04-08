package com.sudoers.elvitrinabackend.service.DonorReward;
import com.sudoers.elvitrinabackend.model.dto.request.DonorRewardRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonorRewardResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import com.sudoers.elvitrinabackend.repository.DonorRewardRepository;
import com.sudoers.elvitrinabackend.model.mapper.DonorRewardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DonorRewardServiceImpl implements DonorRewardService {

    @Autowired
    private DonorRewardRepository donorRewardRepository;

    @Autowired
    private DonorRewardMapper donorRewardMapper;

    @Override
    public DonorRewardResponseDTO saveDonorReward(DonorRewardRequestDTO dto) {
        DonorReward entity = donorRewardMapper.toEntity(dto);
        return donorRewardMapper.toResponseDTO(donorRewardRepository.save(entity));
    }

    @Override
    public DonorRewardResponseDTO getDonorRewardById(Long id) {
        DonorReward reward = donorRewardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DonorReward not found"));
        return donorRewardMapper.toResponseDTO(reward);
    }

    @Override
    public void deleteDonorReward(Long id) {
        donorRewardRepository.deleteById(id);
    }

    @Override
    public DonorRewardResponseDTO updateDonorReward(Long id, DonorRewardRequestDTO dto) {
        DonorReward reward = donorRewardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DonorReward not found"));

        reward.setTitle(dto.getTitle());
        reward.setDescription(dto.getDescription());
        reward.setMinimumDonationAmount(dto.getMinimumDonationAmount() != null ?
                dto.getMinimumDonationAmount().doubleValue() : null);
        reward.setAvailableQuantity(dto.getAvailableQuantity());
        reward.setImageUrl(dto.getImageUrl());

        return donorRewardMapper.toResponseDTO(donorRewardRepository.save(reward));
    }

    @Override
    public List<DonorRewardResponseDTO> getAllRewards() {
        return donorRewardRepository.findAll()
                .stream()
                .map(donorRewardMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
