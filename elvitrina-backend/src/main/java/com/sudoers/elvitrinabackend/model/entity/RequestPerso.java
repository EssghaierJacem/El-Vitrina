package com.sudoers.elvitrinabackend.model.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String title;

    private String description;

    private float minPrice;

    private float maxPrice;

    private String image;

    private LocalDateTime deliveryTime;

    @OneToMany(mappedBy = "requestPerso")
    private List<ProposalPerso> proposals;
}
