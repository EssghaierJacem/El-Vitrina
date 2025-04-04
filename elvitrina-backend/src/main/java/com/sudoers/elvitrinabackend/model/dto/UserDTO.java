package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String name;
    private String lastname;
    private String firstname;
    private String email;
    private String phone;
    private String address;
    private LocalDateTime registrationDate;
    private boolean status;
    private int points;
    private boolean isActive;
    private RoleType role;
    private String password;
    private String image;
}
