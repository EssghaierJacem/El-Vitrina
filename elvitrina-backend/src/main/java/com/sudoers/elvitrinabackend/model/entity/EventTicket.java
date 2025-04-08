package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
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

    private String name;

    private String description;

    private Double price;

    private Integer quantityAvailable;

    private Integer quantityRemaining;

    private Double earlyBirdPricing;

    private String type;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "virtual_event_id")
    private VirtualEvent virtualEvent;

    @OneToOne
    @JoinColumn(name = "event_participant_id", unique = true)
    private EventParticipant eventParticipant;
}
