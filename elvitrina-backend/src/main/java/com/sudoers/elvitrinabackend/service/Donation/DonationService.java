package com.sudoers.elvitrinabackend.service.Donation;


import com.sudoers.elvitrinabackend.model.entity.Donation;

import java.util.List;

public interface DonationService {
    Donation saveDonation(Donation donation);
    List<Donation> getAllDonations();
    Donation getDonationById(Long id);
    void deleteDonation(Long id);
    Donation updateDonation(Long id, Donation donation);

}