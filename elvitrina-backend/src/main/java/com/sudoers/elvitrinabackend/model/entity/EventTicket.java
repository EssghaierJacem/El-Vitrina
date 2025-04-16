package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
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
    private String qrCodeHash;  // Unique identifier for QR
    private Boolean isValid = true;
    private LocalDateTime validUntil;


    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "virtual_event_id")
    private VirtualEvent virtualEvent;

    @OneToOne
    @JoinColumn(name = "event_participant_id", unique = true)
    private EventParticipant eventParticipant;


    @PrePersist
    public void generateQrCode() {
        this.qrCodeHash = UUID.randomUUID().toString();
    }
}
