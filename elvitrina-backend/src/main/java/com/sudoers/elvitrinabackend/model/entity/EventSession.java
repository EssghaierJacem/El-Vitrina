package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventSession {
    @Id
    @GeneratedValue
    private Long sessionId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String sessionTitle;
    private String streamUrl;


    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @ManyToOne
    private VirtualEvent virtualEvent;

}