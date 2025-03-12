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
public class EventTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description must be less than 500 characters")
    @Column(nullable = false)
    private String description;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be a positive number or zero")
    @Column(nullable = false)
    private Double price;

    @NotNull(message = "Quantity available is required")
    @PositiveOrZero(message = "Quantity available must be a positive number or zero")
    @Column(nullable = false)
    private Integer quantityAvailable;

    @NotNull(message = "Quantity remaining is required")
    @PositiveOrZero(message = "Quantity remaining must be a positive number or zero")
    @Column(nullable = false)
    private Integer quantityRemaining;

    @PositiveOrZero(message = "Early bird pricing must be a positive number or zero")
    @Column(nullable = true)
    private Double earlyBirdPricing;

    @NotBlank(message = "Type is required")
    @Size(max = 50, message = "Type must be less than 50 characters")
    @Column(nullable = false)
    private String type;

    @NotNull(message = "Timestamp is required")
    @Column(nullable = false)
    private LocalDateTime timestamp;

    @NotNull(message = "Virtual event is required")
    @ManyToOne
    @JoinColumn(name = "virtual_event_id", nullable = false)
    private VirtualEvent virtualEvent;
}