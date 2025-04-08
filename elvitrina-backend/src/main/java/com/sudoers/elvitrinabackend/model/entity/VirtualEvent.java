package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirtualEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    private String title;

    private String description;

    private LocalDateTime eventDate;

    private String eventType;

    private Double ticketPrice;

    private String status;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;

    @OneToMany(mappedBy = "virtualEvent")
    private List<EventParticipant> participants;

    @OneToMany(mappedBy = "virtualEvent")
    private List<EventTicket> tickets;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
