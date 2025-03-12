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

    @NotNull(message = "Timestamp is required")
    @Column(nullable = false)
    private LocalDateTime timestamp;

    @NotNull(message = "User is required")
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Virtual event is required")
    @ManyToOne
    @JoinColumn(name = "virtual_event_id", nullable = false)
    private VirtualEvent virtualEvent;
}