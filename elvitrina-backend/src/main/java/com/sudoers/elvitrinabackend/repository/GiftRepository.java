package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.Donation;
import com.sudoers.elvitrinabackend.model.entity.Gift;
import com.sudoers.elvitrinabackend.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GiftRepository extends JpaRepository<Gift, Long> {
    boolean existsByDonation(Donation donation);
    boolean existsByDonationAndIsRedeemedTrue(Donation donation);
    List<Gift> findByUserAndIsRedeemedFalse(User user);
    Gift findByGiftCode(String giftCode);
}