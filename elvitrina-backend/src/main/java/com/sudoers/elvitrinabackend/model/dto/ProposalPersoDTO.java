package com.sudoers.elvitrinabackend.model.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProposalPersoDTO {

        private Long requestPersoId;
        private Long id;
      //  private String title;
        private String description;
        private float price;
      //  private String image;
        private Date date;
        // Constructors, getters, and setters
        private UserDTO user;
    private Long userId;
     //   private Long proposalPersoID;

}
