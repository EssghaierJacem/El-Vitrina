package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long giftId;

    private String name;

    private String description;

    private String imageUrl;

    private Boolean won;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "donor_reward_id")
    private DonorReward donorReward;

    @OneToOne
    @JoinColumn(name = "donation_id", unique = true)
    private Donation donation;
}

