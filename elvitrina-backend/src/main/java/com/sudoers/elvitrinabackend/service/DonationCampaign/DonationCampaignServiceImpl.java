package com.sudoers.elvitrinabackend.service.DonationCampaign;


import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;
import com.sudoers.elvitrinabackend.repository.DonationCampaignRepository;
import com.sudoers.elvitrinabackend.service.DonationCampaign.DonationCampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonationCampaignServiceImpl implements DonationCampaignService {

    @Autowired
    private DonationCampaignRepository donationCampaignRepository;

    @Override
    public DonationCampaign saveDonationCampaign(DonationCampaign donationCampaign) {
        return donationCampaignRepository.save(donationCampaign);
    }

    @Override
    public List<DonationCampaign> getAllDonationCampaigns() {
        return donationCampaignRepository.findAll();
    }

    @Override
    public DonationCampaign getDonationCampaignById(Long id) {
        Optional<DonationCampaign> donationCampaign = donationCampaignRepository.findById(id);
        return donationCampaign.orElseThrow(() -> new RuntimeException("DonationCampaign not found"));
    }

    @Override
    public void deleteDonationCampaign(Long id) {
        donationCampaignRepository.deleteById(id);
    }

    @Override
    public DonationCampaign updateDonationCampaign(Long id, DonationCampaign donationCampaign) {
        DonationCampaign existingCampaign = getDonationCampaignById(id);
        existingCampaign.setTitle(donationCampaign.getTitle());
        existingCampaign.setDescription(donationCampaign.getDescription());
        existingCampaign.setCause(donationCampaign.getCause());
        existingCampaign.setGoal(donationCampaign.getGoal());
        existingCampaign.setCurrentAmount(donationCampaign.getCurrentAmount());
        existingCampaign.setStartDate(donationCampaign.getStartDate());
        existingCampaign.setEndDate(donationCampaign.getEndDate());
        existingCampaign.setStatus(donationCampaign.getStatus());
        existingCampaign.setTimestamp(donationCampaign.getTimestamp());
        existingCampaign.setStore(donationCampaign.getStore());
        existingCampaign.setUser(donationCampaign.getUser());
        return donationCampaignRepository.save(existingCampaign);
    }


}