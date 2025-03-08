package com.sudoers.elvitrinabackend.model.entity;

import com.sudoers.elvitrinabackend.model.enums.FormationCategoryType;
import com.sudoers.elvitrinabackend.model.enums.LevelType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseTitle;

    private String description;

    @Enumerated(EnumType.STRING)
    private FormationCategoryType formationCategory;

    private int duration;

    private boolean certificateAvailable;

    private String language;

    private double price;

    @Enumerated(EnumType.STRING)
    private LevelType level;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
