package com.sudoers.elvitrinabackend.service.Gift;
import com.sudoers.elvitrinabackend.model.dto.request.GiftRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.GiftResponseDTO;
import com.sudoers.elvitrinabackend.model.mapper.GiftMapper;
import com.sudoers.elvitrinabackend.model.entity.*;
import com.sudoers.elvitrinabackend.repository.*;
import com.sudoers.elvitrinabackend.service.Gift.GiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GiftServiceImpl implements GiftService {

    private final GiftRepository giftRepository;
    private final DonationRepository donationRepository;
    private final DonorRewardRepository donorRewardRepository;
    private final UserRepository userRepository;
    private final GiftMapper giftMapper;

    @Override
    public GiftResponseDTO createGift(GiftRequestDTO dto) {
        Donation donation = donationRepository.findById(dto.getDonationId())
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        DonorReward reward = null;
        if (dto.getRewardId() != null) {
            reward = donorRewardRepository.findById(dto.getRewardId())
                    .orElseThrow(() -> new RuntimeException("Reward not found"));
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Gift gift = giftMapper.toEntity(dto, donation, reward, user);
        return giftMapper.toDto(giftRepository.save(gift));
    }

    @Override
    public GiftResponseDTO getGiftById(Long id) {
        return giftRepository.findById(id)
                .map(giftMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Gift not found"));
    }

    @Override
    public List<GiftResponseDTO> getAllGifts() {
        return giftRepository.findAll()
                .stream()
                .map(giftMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteGift(Long id) {
        giftRepository.deleteById(id);
    }
}