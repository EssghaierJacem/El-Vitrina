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
public class EventParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Attended status is required")
    @Column(nullable = false)
    private Boolean attended;

    // @NotNull(message = "Timestamp is required")
    @Column(nullable = true)
    private LocalDateTime timestamp;

    //  @NotNull(message = "User is required")
    @OneToOne
    @JoinColumn(name = "user_id", nullable = true, unique = true)
    private User user;

    // @NotNull(message = "Virtual event is required")
    @ManyToOne
    @JoinColumn(name = "virtual_event_id", nullable = true)
    private VirtualEvent virtualEvent;

    @OneToOne(mappedBy = "eventParticipant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private EventTicket eventTicket;
}