package com.sudoers.elvitrinabackend.model.entity;

import com.sudoers.elvitrinabackend.model.enums.AdStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Builder

public class Ad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String content;
    private String imageUrl;

    @Column(nullable = false)
    private String targetUrl;

    @Column(nullable = false)
    private String advertiserEmail;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String position; // e.g., "top", "sidebar", "bottom"
    private Integer width;
    private Integer height;

    @Column(nullable = false)
    private Boolean isApproved = false;

    @Column(nullable = false)
    private Integer impressions = 0;

    @Column(nullable = false)
    private Integer clicks = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdStatus status = AdStatus.PENDING;

    private String rejectionReason;

    @Column(nullable = false)
    private String displayType; // BANNER, POPUP, INTERSTITIAL
    private Integer displayDuration; // Seconds (for popups/interstitials)
    private Integer frequencyCap; // Max displays per user (optional)
    // Constructors, Getters, Setters
    // Consider adding builder pattern
}