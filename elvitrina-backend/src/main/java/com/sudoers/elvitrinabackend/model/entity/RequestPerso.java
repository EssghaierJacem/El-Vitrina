package com.sudoers.elvitrinabackend.model.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestPerso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Many RequestPersons belong to one User (Many-to-One)
    //@JsonManagedReference  // The "forward" side of the relationship
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    private String title;

    private String description;

    private float minPrice;

    private float maxPrice;

    private String image;

    private LocalDateTime deliveryTime;

    private int viewCount;

    private List<String> tags;

    // One RequestPerson can have many ProposalPersons (One-to-Many)

    @OneToMany(mappedBy = "requestPerso", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProposalPerso> proposals;

}
