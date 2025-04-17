package com.sudoers.elvitrinabackend.service.Quiz;
import com.sudoers.elvitrinabackend.model.dto.AnswerRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.QuizDTO;

import java.util.List;
import java.util.Optional;

public interface IQuizService {
    QuizDTO createQuiz(QuizDTO quizDTO);
    Optional<QuizDTO> getQuizById(Long id);
    List<QuizDTO> getAllQuizzes();
    QuizDTO updateQuiz(Long id, QuizDTO quizDTO);
    void deleteQuiz(Long id);
    void saveUserAnswer(Long questionId, AnswerRequestDTO userAnswer);

}
