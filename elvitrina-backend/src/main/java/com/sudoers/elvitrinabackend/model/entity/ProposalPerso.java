package com.sudoers.elvitrinabackend.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProposalPerso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Many ProposalPersons belong to one RequestPerson (Many-to-One)
    //@JsonBackReference  // The "back" side of the relationship
    @ManyToOne
    @JoinColumn(name = "request_perso_id")
    private RequestPerso requestPerso;
    private String title;

    private String description;

    private float price;

    private String image;

    private LocalDateTime deliveryTime;

}
