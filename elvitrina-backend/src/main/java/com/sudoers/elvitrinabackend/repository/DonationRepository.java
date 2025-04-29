package com.sudoers.elvitrinabackend.repository;

import com.sudoers.elvitrinabackend.model.entity.Donation;
import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import com.sudoers.elvitrinabackend.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonationCampaignCampaignId(Long campaignId);
    List<Donation> findByUser(User user);
    List<Donation> findByStoreStoreId(Long storeId);
    List<Donation> findByUserIdOrderByCreatedAtDesc(Long userId);
    @Query("SELECT d FROM Donation d WHERE d.donationCampaign.campaignId = :campaignId ORDER BY d.updatedAt DESC")
    List<Donation> findTop5ByCampaignOrderByUpdatedAtDesc(@Param("campaignId") Long campaignId);
    @Query("SELECT AVG(d.amount) FROM Donation d")
    Double findAverageDonationAmount();

    @Query("""
    SELECT FUNCTION('YEAR', d.createdAt) AS year, SUM(d.amount)
    FROM Donation d
    WHERE d.createdAt IS NOT NULL
    GROUP BY FUNCTION('YEAR', d.createdAt)
    ORDER BY FUNCTION('YEAR', d.createdAt)
    """)
    List<Object[]> sumDonationsPerYear();


}
