package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @Column(name = "delivered", nullable = false)
    private boolean delivered = false;

    private String content;

    private LocalDateTime sentAt;
}
