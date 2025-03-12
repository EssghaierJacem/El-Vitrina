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
public class DonorReward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rewardId;

    @NotBlank(message = "Type is required")
    @Size(max = 50, message = "Type must be less than 50 characters")
    @Column(nullable = false)
    private String type;

    @NotBlank(message = "Details are required")
    @Size(max = 500, message = "Details must be less than 500 characters")
    @Column(nullable = false)
    private String details;

    @NotNull(message = "Issuance date is required")
    @Column(nullable = false)
    private LocalDateTime issuanceDate;

    @NotNull(message = "Expiration date is required")
    @Future(message = "Expiration date must be in the future")
    @Column(nullable = false)
    private LocalDateTime expirationDate;

    @NotBlank(message = "Redemption status is required")
    @Size(max = 50, message = "Redemption status must be less than 50 characters")
    @Column(nullable = false)
    private String redemptionStatus;

    @Column(nullable = true)
    private LocalDateTime redemptionDate;

    @Size(max = 50, message = "Redemption code must be less than 50 characters")
    @Column(nullable = true)
    private String redemptionCode;

    @NotNull(message = "Timestamp is required")
    @Column(nullable = false)
    private LocalDateTime timestamp;

    @NotNull(message = "Donation is required")
    @OneToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;
}