package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be a positive number")
    @Column(nullable = false)
    private Double amount;

    @NotBlank(message = "Type is required")
    @Size(max = 50, message = "Type must be less than 50 characters")
    @Column(nullable = false)
    private String type;

    @NotNull(message = "Anonymity setting is required")
    @Column(nullable = false)
    private Boolean anonymitySetting;

    @Size(max = 500, message = "Donor message must be less than 500 characters")
    @Column(nullable = true)
    private String donorMessage;

    // @NotNull(message = "Timestamp is required")
    @Column(nullable = true)
    private LocalDateTime timestamp;

    //@NotNull(message = "Store is required")
    @ManyToOne
    @JoinColumn(name = "store_id", nullable = true)
    private Store store;

    @ManyToOne
    @JoinColumn(name = "campaign_id", nullable = true)
    private DonationCampaign donationCampaign;

   // @NotNull(message = "User is required")
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @OneToOne(mappedBy = "donation")
    private DonorReward donorReward;
}