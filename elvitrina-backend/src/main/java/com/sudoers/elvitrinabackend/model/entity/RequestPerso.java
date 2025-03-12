package com.sudoers.elvitrinabackend.model.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
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

    @OneToMany(mappedBy = "requestPerso", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProposalPerso> proposals;
}
