package com.sudoers.elvitrinabackend.service.Donation;


import com.sudoers.elvitrinabackend.model.entity.Donation;
import com.sudoers.elvitrinabackend.repository.DonationRepository;
import com.sudoers.elvitrinabackend.service.Donation.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonationServiceImpl implements DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Override
    public Donation saveDonation(Donation donation) {
        return donationRepository.save(donation);
    }

    @Override
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    @Override
    public Donation getDonationById(Long id) {
        Optional<Donation> donation = donationRepository.findById(id);
        return donation.orElseThrow(() -> new RuntimeException("Donation not found"));
    }

    @Override
    public void deleteDonation(Long id) {
        donationRepository.deleteById(id);
    }

    @Override
    public Donation updateDonation(Long id, Donation donation) {
        Donation existingDonation = getDonationById(id);
        existingDonation.setAmount(donation.getAmount());
        existingDonation.setType(donation.getType());
        existingDonation.setAnonymitySetting(donation.getAnonymitySetting());
        existingDonation.setDonorMessage(donation.getDonorMessage());
        existingDonation.setTimestamp(donation.getTimestamp());
        existingDonation.setStore(donation.getStore());
        existingDonation.setDonationCampaign(donation.getDonationCampaign());
        existingDonation.setUser(donation.getUser());
        return donationRepository.save(existingDonation);
    }



}
