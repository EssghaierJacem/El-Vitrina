package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Advertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adId;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Content is required")
    @Size(max = 500, message = "Content must be less than 500 characters")
    @Column(nullable = false)
    private String content;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be in the present or future")
    @Column(nullable = false)
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    @Column(nullable = false)
    private LocalDateTime endDate;

    @NotNull(message = "Budget is required")
    @PositiveOrZero(message = "Budget must be a positive number or zero")
    @Column(nullable = false)
    private Double budget;

    @NotNull(message = "Impressions is required")
    @PositiveOrZero(message = "Impressions must be a positive number or zero")
    @Column(nullable = false)
    private Integer impressions;

    @NotNull(message = "Clicks is required")
    @PositiveOrZero(message = "Clicks must be a positive number or zero")
    @Column(nullable = false)
    private Integer clicks;

    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must be less than 50 characters")
    @Column(nullable = false)
    private String status;

   // @NotNull(message = "Timestamp is required")
    @Column(nullable = true)
    private LocalDateTime timestamp;

    @Size(max = 255, message = "Video URL must be less than 255 characters")
    @Column(nullable = true)
    private String videoUrl;

    @ElementCollection
    @Column(nullable = true)
    private Set<String> images;

    //@NotNull(message = "Store is required")
    @ManyToOne
    @JoinColumn(name = "store_id", nullable = true)
    private Store store;

    //@NotNull(message = "Creator is required")
    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = true)
    private Creator creator;
}