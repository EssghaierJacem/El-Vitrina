package com.sudoers.elvitrinabackend.model.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RequestPersoDTO {
    private Long id; // Send only the user's ID
   private Long userId; // Send only the user's ID
    private String title;
    private String description;
    private float minPrice;
    private float maxPrice;
    private String image;
    private Date deliveryTime;
    private int viewCount;
 private Date date;
    private List<String> tags;
    private List<ProposalPersoDTO> proposals; // Ensure this field is present
    private UserDTO user;
    private String status;
}
