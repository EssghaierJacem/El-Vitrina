package com.sudoers.elvitrinabackend.service.Quizz;

import com.sudoers.elvitrinabackend.model.entity.Quiz;

import java.util.List;
import java.util.Optional;

public interface IQuizService {
    Quiz createQuiz(Quiz quiz);
    Optional<Quiz> getQuizById(Long id);
    List<Quiz> getAllQuizzes();
    Quiz updateQuiz(Long id, Quiz quiz);
    void deleteQuiz(Long id);


    //int calculateScore(Long quizId, List<Long> responses);

    String analyzePersonality(int score);

    //----------------------Methodes avancées------------//
}
