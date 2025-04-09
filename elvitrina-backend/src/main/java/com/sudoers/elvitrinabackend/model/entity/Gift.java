package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

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

    private String giftCode;

    private Boolean isRedeemed;
    private Boolean isshared;


    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;



    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "donor_reward_id")
    private DonorReward donorReward;

    @OneToOne
    @JoinColumn(name = "donation_id", unique = true)
    private Donation donation;

    @PrePersist
    public void generateGiftCode() {
        if (this.giftCode == null) {
            this.giftCode = UUID.randomUUID().toString();
        }
        this.isRedeemed = false;
    }

}

