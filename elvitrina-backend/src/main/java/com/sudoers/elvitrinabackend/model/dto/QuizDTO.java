package com.sudoers.elvitrinabackend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {

    private String question;

    private String option1;

    private String option2;

    private String option3;

    private String bonneReponse;

    private String reponseUser;
    private  int score ;

    private Long userId;
}
