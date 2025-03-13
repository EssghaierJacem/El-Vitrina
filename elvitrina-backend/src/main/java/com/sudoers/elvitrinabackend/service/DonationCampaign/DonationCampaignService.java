package com.sudoers.elvitrinabackend.service.DonationCampaign;


import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;

import java.util.List;

public interface DonationCampaignService {
    DonationCampaign saveDonationCampaign(DonationCampaign donationCampaign);
    List<DonationCampaign> getAllDonationCampaigns();
    DonationCampaign getDonationCampaignById(Long id);
    void deleteDonationCampaign(Long id);
    DonationCampaign updateDonationCampaign(Long id, DonationCampaign donationCampaign);

}