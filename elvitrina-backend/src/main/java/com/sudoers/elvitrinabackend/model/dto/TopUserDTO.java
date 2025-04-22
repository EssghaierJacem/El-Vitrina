package com.sudoers.elvitrinabackend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopUserDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private int points;
    private String image;
    private String phone;
}
