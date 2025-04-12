package com.sudoers.elvitrinabackend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO {

    private Long id;

    private String response;

    private Long questionId;
}
