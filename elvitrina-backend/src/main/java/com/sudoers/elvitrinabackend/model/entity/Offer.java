package com.sudoers.elvitrinabackend.model.entity;

import com.sudoers.elvitrinabackend.model.enums.OfferType;
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
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Offer name is mandatory")
    @Size(max = 150, message = "Offer name can't exceed 150 characters")
    private String name;

    @NotBlank(message = "Description is mandatory")
    @Size(max = 500, message = "Description can't exceed 500 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = true, message = "Discount must be zero or positive")
    @DecimalMax(value = "100.0", inclusive = true, message = "Discount cannot exceed 100%")
    private double discount;

    @NotNull(message = "Start date is mandatory")
    private LocalDateTime startDate;

    @NotNull(message = "End date is mandatory")
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Offer type is mandatory")
    private OfferType offer;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @NotNull(message = "User is mandatory")
    private User user;
}
