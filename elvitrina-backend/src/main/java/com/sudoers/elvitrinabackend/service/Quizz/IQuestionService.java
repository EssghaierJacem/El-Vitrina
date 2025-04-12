package com.sudoers.elvitrinabackend.service.Quizz;

import com.sudoers.elvitrinabackend.model.dto.QuestionDTO;

import java.util.List;
import java.util.Optional;

public interface IQuestionService {
    QuestionDTO createQuestion(QuestionDTO questionDTO);
    Optional<QuestionDTO> getQuestionById(Long id);
    List<QuestionDTO> getAllQuestions();
    QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO);

    List<QuestionDTO> getQuestionsByQuizId(Long quizId);

    void deleteQuestion(Long id);
}
