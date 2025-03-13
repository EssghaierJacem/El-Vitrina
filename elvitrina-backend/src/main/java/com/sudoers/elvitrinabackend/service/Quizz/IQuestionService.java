package com.sudoers.elvitrinabackend.service.Quizz;

import com.sudoers.elvitrinabackend.model.entity.Question;

import java.util.List;
import java.util.Optional;

public interface IQuestionService {
    Question createQuestion(Question question);
    Optional<Question> getQuestionById(Long id);
    List<Question> getAllQuestions();
    Question updateQuestion(Long id, Question question);
    void deleteQuestion(Long id);
}
