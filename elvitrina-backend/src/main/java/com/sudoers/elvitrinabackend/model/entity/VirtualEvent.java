package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirtualEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description must be less than 500 characters")
    @Column(nullable = false)
    private String description;

    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    @Column(nullable = false)
    private LocalDateTime eventDate;

    @NotBlank(message = "Event type is required")
    @Size(max = 50, message = "Event type must be less than 50 characters")
    @Column(nullable = false)
    private String eventType;

    @NotNull(message = "Ticket price is required")
    @PositiveOrZero(message = "Ticket price must be a positive number or zero")
    @Column(nullable = false)
    private Double ticketPrice;

    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must be less than 50 characters")
    @Column(nullable = false)
    private String status;

    // @NotNull(message = "Timestamp is required")
    @Column(nullable = true)
    private LocalDateTime timestamp;

    // @NotNull(message = "Store is required")
    @ManyToOne
    @JoinColumn(name = "store_id", nullable = true)
    private Store store;

    @OneToMany(mappedBy = "virtualEvent")
    private List<EventParticipant> participants;

    @OneToMany(mappedBy = "virtualEvent")
    private List<EventTicket> tickets;

    @ManyToOne
    @JoinColumn(name = "user_id" , nullable = true)
    private User user;
}