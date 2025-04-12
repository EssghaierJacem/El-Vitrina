package com.sudoers.elvitrinabackend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {

    private Long id;

    private String title;

    private String description;

    private int score;

    private List<Long> questionIds;

    private Long userId;
}
