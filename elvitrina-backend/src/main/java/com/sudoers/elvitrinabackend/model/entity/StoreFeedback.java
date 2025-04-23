package com.sudoers.elvitrinabackend.model.entity;

import com.sudoers.elvitrinabackend.model.enums.AppFeedbackType;
import com.sudoers.elvitrinabackend.model.enums.StoreFeedbackType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoreFeedback implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long StoreFeedbackId;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private int rating;

    @NotBlank(message = "Comment is required")
    @Size(max = 1000, message = "Comment must be less than 1000 characters")
    private String comment;

    @CreatedDate
    private LocalDateTime createdAt;

    @NotNull(message = "Would recommend field is required")
    private boolean wouldRecommend;

    @Enumerated(EnumType.STRING)
    private StoreFeedbackType storeFeedbackType;

    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;
}