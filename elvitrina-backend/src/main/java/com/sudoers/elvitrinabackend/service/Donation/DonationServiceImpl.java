package com.sudoers.elvitrinabackend.service.Donation;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.request.DonationRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.Donation;
import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;
import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.mapper.DonationMapper;
import com.sudoers.elvitrinabackend.repository.DonationCampaignRepository;
import com.sudoers.elvitrinabackend.repository.DonationRepository;
import com.sudoers.elvitrinabackend.repository.DonorRewardRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;
    private final DonationMapper donationMapper;
    private final DonationCampaignRepository donationCampaignRepository;
    private final UserRepository userRepository;
    private final DonorRewardRepository donorRewardRepository;

    @Autowired
    public DonationServiceImpl(DonationRepository donationRepository,
                               DonationMapper donationMapper,
                               DonationCampaignRepository donationCampaignRepository,
                               UserRepository userRepository,
                               DonorRewardRepository donorRewardRepository) {
        this.donationRepository = donationRepository;
        this.donationMapper = donationMapper;
        this.donationCampaignRepository = donationCampaignRepository;
        this.userRepository = userRepository;
        this.donorRewardRepository = donorRewardRepository;
    }

    @Override
    @Transactional
    public DonationResponseDTO saveDonation(DonationRequestDTO requestDTO) {
        Donation donation = donationMapper.toEntity(requestDTO);
        donation.setCreatedAt(LocalDateTime.now());

        if (requestDTO.getCampaignId() != null) {
            DonationCampaign campaign = donationCampaignRepository.findById(requestDTO.getCampaignId())
                    .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + requestDTO.getCampaignId()));
            donation.setDonationCampaign(campaign);
        }

        if (requestDTO.getUserId() != null) {
            User user = userRepository.findById(requestDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));
            donation.setUser(user);
        }



        Donation savedDonation = donationRepository.save(donation);
        return donationMapper.toResponseDTO(savedDonation);
    }

    @Override
    public List<DonationResponseDTO> getAllDonations() {
        return donationRepository.findAll().stream()
                .map(donationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DonationResponseDTO getDonationById(Long id) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));
        return donationMapper.toResponseDTO(donation);
    }

    @Override
    @Transactional
    public void deleteDonation(Long id) {
        if (!donationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Donation not found with id: " + id);
        }
        donationRepository.deleteById(id);
    }

    @Override
    @Transactional
    public DonationResponseDTO updateDonation(Long id, DonationRequestDTO requestDTO) {
        Donation existingDonation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));

        donationMapper.updateEntityFromDTO(requestDTO, existingDonation);
        existingDonation.setUpdatedAt(LocalDateTime.now());

        if (requestDTO.getCampaignId() != null) {
            DonationCampaign campaign = donationCampaignRepository.findById(requestDTO.getCampaignId())
                    .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + requestDTO.getCampaignId()));
            existingDonation.setDonationCampaign(campaign);
        }

        if (requestDTO.getUserId() != null) {
            User user = userRepository.findById(requestDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));
            existingDonation.setUser(user);
        }


        Donation updatedDonation = donationRepository.save(existingDonation);
        return donationMapper.toResponseDTO(updatedDonation);
    }

    @Override
    public Page<DonationResponseDTO> getDonationsPaginated(Pageable pageable) {
        return donationRepository.findAll(pageable)
                .map(donationMapper::toResponseDTO);
    }

    @Override
    public List<DonationResponseDTO> getDonationsByCampaignId(Long campaignId) {
        if (!donationCampaignRepository.existsById(campaignId)) {
            throw new ResourceNotFoundException("Campaign not found with id: " + campaignId);
        }

        return donationRepository.findByDonationCampaignCampaignId(campaignId).stream()
                .map(donationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
