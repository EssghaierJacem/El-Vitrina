package com.sudoers.elvitrinabackend.model.entity;

import com.sudoers.elvitrinabackend.model.enums.AppFeedbackType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class AppFeedback implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Comment is required")
    @Size(max = 1000, message = "Comment must be less than 1000 characters")
    private String comment;

    @CreatedDate
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private AppFeedbackType appFeedbackType;

    @Email(message = "Contact email must be a valid email address")
    @Size(max = 100, message = "Contact email must be less than 100 characters")
    private String contactEmail;
}
