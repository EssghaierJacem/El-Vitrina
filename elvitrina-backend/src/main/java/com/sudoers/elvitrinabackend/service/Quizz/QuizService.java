package com.sudoers.elvitrinabackend.service.Quizz;


import com.sudoers.elvitrinabackend.model.entity.Question;
import com.sudoers.elvitrinabackend.model.entity.Quiz;
import com.sudoers.elvitrinabackend.model.entity.Response;
import com.sudoers.elvitrinabackend.repository.QuestionRepository;
import com.sudoers.elvitrinabackend.repository.QuizRepository;
import com.sudoers.elvitrinabackend.repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuizService  implements IQuizService {

    private final QuizRepository quizRepository;
    private final ResponseRepository responseRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public QuizService(QuizRepository quizRepository, ResponseRepository responseRepository, QuestionRepository questionRepository) {

        this.quizRepository = quizRepository;
        this.responseRepository = responseRepository;
        this.questionRepository = questionRepository;
    }
//----------------------Crud--------------//
    @Override
    public Quiz createQuiz(Quiz quiz) {
        quiz.setId(null);
        return quizRepository.save(quiz);


    }

    @Override
    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    @Override
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @Override
    public Quiz updateQuiz(Long id, Quiz quiz) {
        if (!quizRepository.existsById(id)) {
            return null; // Or throw an exception like ResourceNotFoundException
        }
        quiz.setId(id);
        return quizRepository.save(quiz);
    }

    @Override
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }




    @Override
    public String analyzePersonality(int score) {
        // Logique d'analyse de la personnalité en fonction du score
        if (score >= 0 && score <= 10) {
            return "Créatif";
        } else if (score > 10 && score <= 20) {
            return "Sportif";
        } else {
            return "Analyse avancée nécessaire";
        }
    }
}
