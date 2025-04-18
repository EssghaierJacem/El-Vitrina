package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorReward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rewardId;

    private String title;
    private String description;
    private Double minimumDonationAmount;
    private Integer availableQuantity;
    private Integer claimedQuantity = 0;
    private String imageUrl;

    private LocalDateTime issuanceDate = LocalDateTime.now();
    private LocalDateTime expirationDate;
    private LocalDateTime redemptionDate;
    private Integer redemptionCode;
    private String redemptionStatus;
    private String tierLevel;
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "donorReward")
    private List<Gift> gifts;


    @ManyToOne
    private DonationCampaign campaign;

    public boolean isAvailable() {
        return (availableQuantity == null || claimedQuantity < availableQuantity) &&
                (expirationDate == null || expirationDate.isAfter(LocalDateTime.now()));
    }
}