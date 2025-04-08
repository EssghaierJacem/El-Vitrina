package com.sudoers.elvitrinabackend.service.DonationCampaign;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.request.DonationCampaignRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationCampaignResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;
import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import com.sudoers.elvitrinabackend.model.entity.Store;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.mapper.DonationCampaignMapper;
import com.sudoers.elvitrinabackend.model.mapper.DonorRewardMapper;
import com.sudoers.elvitrinabackend.repository.DonationCampaignRepository;
import com.sudoers.elvitrinabackend.repository.DonorRewardRepository;
import com.sudoers.elvitrinabackend.repository.StoreRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DonationCampaignServiceImpl implements DonationCampaignService {

    private final DonationCampaignRepository donationCampaignRepository;
    private final DonationCampaignMapper donationCampaignMapper;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final DonorRewardRepository donorRewardRepository;
    private final DonorRewardMapper donorRewardMapper;

    @Autowired
    public DonationCampaignServiceImpl(DonationCampaignRepository donationCampaignRepository,
                                       DonationCampaignMapper donationCampaignMapper,
                                       UserRepository userRepository,
                                       StoreRepository storeRepository,
                                       DonorRewardRepository donorRewardRepository,
                                       DonorRewardMapper donorRewardMapper) {
        this.donationCampaignRepository = donationCampaignRepository;
        this.donationCampaignMapper = donationCampaignMapper;
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.donorRewardRepository = donorRewardRepository;
        this.donorRewardMapper = donorRewardMapper;
    }

    @Override
    public DonationCampaignResponseDTO save(DonationCampaignRequestDTO requestDTO) {
        DonationCampaign campaign = donationCampaignMapper.toEntity(requestDTO);
        campaign.setTimestamp(LocalDateTime.now());

        campaign.setUser(getUserIfExists(requestDTO.getUserId()));
        campaign.setStore(getStoreIfExists(requestDTO.getStoreId()));
        campaign.setRewards(getMappedRewards(requestDTO, campaign));

        return donationCampaignMapper.toResponseDTO(donationCampaignRepository.save(campaign));
    }

    @Override
    public List<DonationCampaignResponseDTO> getAll() {
        return donationCampaignRepository.findAll().stream()
                .map(donationCampaignMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DonationCampaignResponseDTO getById(Long id) {
        DonationCampaign campaign = donationCampaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation campaign not found with id: " + id));
        return donationCampaignMapper.toResponseDTO(campaign);
    }

    @Override
    public void delete(Long id) {
        if (!donationCampaignRepository.existsById(id)) {
            throw new ResourceNotFoundException("Donation campaign not found with id: " + id);
        }
        donationCampaignRepository.deleteById(id);
    }

    @Override
    public DonationCampaignResponseDTO update(Long id, DonationCampaignRequestDTO requestDTO) {
        DonationCampaign existing = donationCampaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation campaign not found with id: " + id));

        donationCampaignMapper.updateEntity(requestDTO, existing);
        existing.setTimestamp(LocalDateTime.now());
        existing.setUser(getUserIfExists(requestDTO.getUserId()));
        existing.setStore(getStoreIfExists(requestDTO.getStoreId()));


        return donationCampaignMapper.toResponseDTO(donationCampaignRepository.save(existing));
    }

    @Override
    public Page<DonationCampaignResponseDTO> getPaginated(Pageable pageable) {
        return donationCampaignRepository.findAll(pageable)
                .map(donationCampaignMapper::toResponseDTO);
    }

    @Override
    public List<DonationCampaignResponseDTO> getActive() {
        return donationCampaignRepository
                .findByStatusAndEndDateAfter("ACTIVE", LocalDateTime.now())
                .stream()
                .map(donationCampaignMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // --- Private Utility Methods ---

    private User getUserIfExists(Long userId) {
        return userId != null ? userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId)) : null;
    }

    private Store getStoreIfExists(Long storeId) {
        return storeId != null ? storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId)) : null;
    }

    private List<DonorReward> getMappedRewards(DonationCampaignRequestDTO requestDTO, DonationCampaign campaign) {
        if (requestDTO.getRewards() == null || requestDTO.getRewards().isEmpty()) {
            return new ArrayList<>();
        }

        return requestDTO.getRewards().stream()
                .map(donorRewardMapper::toEntity)
                .peek(reward -> reward.setCampaign(campaign))
                .collect(Collectors.toList());
    }

}
