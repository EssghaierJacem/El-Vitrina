package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonationCampaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long campaignId;

    private String title;

    private String description;

    private String cause;

    private double goal;
    private double currentAmount;


    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String status;

    private LocalDateTime timestamp;

    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL)
    private List<DonorReward> rewards;

    public double getProgressPercentage() {
        return goal > 0 ? (currentAmount / goal) * 100 : 0.0;
    }

    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "donationCampaign")
    private List<Donation> donations;
}
