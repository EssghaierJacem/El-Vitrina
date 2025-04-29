package com.sudoers.elvitrinabackend.model.entity;

import com.sudoers.elvitrinabackend.model.enums.EventMode;
import com.sudoers.elvitrinabackend.model.enums.EventType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
    private String eventImage;
    private LocalDateTime eventDate;
    private Double ticketPrice;

    private String status;




    private EventType eventType;
    private EventMode eventMode;

    @OneToMany(mappedBy = "virtualEvent", cascade = CascadeType.ALL)
    private List<EventSession> sessions;

    private Integer maxParticipants;
    private String streamUrl;
    private String chatChannelId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

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

