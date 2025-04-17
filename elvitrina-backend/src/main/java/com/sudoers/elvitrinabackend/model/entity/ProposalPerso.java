package com.sudoers.elvitrinabackend.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

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
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "request_perso_id")
    private RequestPerso requestPerso;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

 //   private String title;
    private String description;

    private float price;

    // private String image;

    private Date date;

   // private Long ProposalPersoID;
}
