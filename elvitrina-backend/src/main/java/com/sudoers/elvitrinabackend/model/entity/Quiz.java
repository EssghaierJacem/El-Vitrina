package com.sudoers.elvitrinabackend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String question;

    private String option1;

    private String option2;

    private String option3;

    private String bonneReponse;

    private int score ;

    private String reponseUser;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;


}
