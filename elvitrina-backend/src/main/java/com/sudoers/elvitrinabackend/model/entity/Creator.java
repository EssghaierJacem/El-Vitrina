package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Creator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long creatorId;

    @NotBlank(message = "Bio is required")
    @Size(max = 500, message = "Bio must be less than 500 characters")
    @Column(nullable = false)
    private String bio;

    @NotBlank(message = "Specialties are required")
    @Size(max = 255, message = "Specialties must be less than 255 characters")
    @Column(nullable = false)
    private String specialties;

    // @NotBlank(message = "Portfolio is required")
    @Size(max = 255, message = "Portfolio must be less than 255 characters")
    @Column(nullable = false)
    private String portfolio;

    @NotNull(message = "Commission rate is required")
    @PositiveOrZero(message = "Commission rate must be a positive number or zero")
    @Column(nullable = false)
    private Double commissionRate;

    @NotBlank(message = "Tier classification is required")
    @Size(max = 50, message = "Tier classification must be less than 50 characters")
    @Column(nullable = false)
    private String tierClassification;

    // @NotNull(message = "Timestamp is required")
    @Column(nullable = true)
    private LocalDateTime timestamp;

    @Size(max = 255, message = "Facebook link must be less than 255 characters")
    @Column(nullable = true)
    private String facebookLink;

    @Size(max = 255, message = "YouTube link must be less than 255 characters")
    @Column(nullable = true)
    private String youtubeLink;

    @Size(max = 255, message = "GitHub link must be less than 255 characters")
    @Column(nullable = true)
    private String githubLink;

    @Size(max = 255, message = "LinkedIn link must be less than 255 characters")
    @Column(nullable = true)
    private String linkedinLink;

    @Size(max = 255, message = "Behance link must be less than 255 characters")
    @Column(nullable = true)
    private String behanceLink;

    @Size(max = 255, message = "Instagram link must be less than 255 characters")
    @Column(nullable = true)
    private String instagramLink;

    @Size(max = 255, message = "Snapchat link must be less than 255 characters")
    @Column(nullable = true)
    private String snapchatLink;

    @Size(max = 255, message = "WhatsApp link must be less than 255 characters")
    @Column(nullable = true)
    private String whatsappLink;

    // @NotNull(message = "User is required")
    @OneToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @OneToMany(mappedBy = "creator")
    private List<Advertisement> advertisements;
}