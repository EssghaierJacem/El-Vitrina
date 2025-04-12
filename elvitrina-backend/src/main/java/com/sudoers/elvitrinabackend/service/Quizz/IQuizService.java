package com.sudoers.elvitrinabackend.service.Quizz;

import com.sudoers.elvitrinabackend.model.dto.QuizDTO;

import java.util.List;
import java.util.Optional;

public interface IQuizService {
    QuizDTO createQuiz(QuizDTO quizDTO);
    Optional<QuizDTO> getQuizById(Long id);
    List<QuizDTO> getAllQuizzes();
    QuizDTO updateQuiz(Long id, QuizDTO quizDTO);
    void deleteQuiz(Long id);

    String analyzePersonality(int score);
}
