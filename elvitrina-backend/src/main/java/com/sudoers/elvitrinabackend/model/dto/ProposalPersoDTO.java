package com.sudoers.elvitrinabackend.model.dto;

import lombok.*;

import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProposalPerso {


        private Long id;
        private String title;
        private String description;
        private float price;
        private String image;
        private LocalDateTime deliveryTime;

        // Constructors, getters, and setters

}
