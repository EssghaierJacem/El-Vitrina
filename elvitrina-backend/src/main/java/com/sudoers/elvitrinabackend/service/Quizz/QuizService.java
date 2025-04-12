package com.sudoers.elvitrinabackend.service.Quizz;

import com.sudoers.elvitrinabackend.model.dto.QuizDTO;
import com.sudoers.elvitrinabackend.model.dto.QuestionDTO;
import com.sudoers.elvitrinabackend.model.dto.ResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.Quiz;
import com.sudoers.elvitrinabackend.model.entity.Question;
import com.sudoers.elvitrinabackend.model.entity.Response;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.QuizRepository;
import com.sudoers.elvitrinabackend.repository.QuestionRepository;
import com.sudoers.elvitrinabackend.repository.ResponseRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizService implements IQuizService {

    private final QuizRepository quizRepository;
    private final ResponseRepository responseRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    @Autowired
    public QuizService(QuizRepository quizRepository, ResponseRepository responseRepository, QuestionRepository questionRepository, UserRepository userRepository) {
        this.quizRepository = quizRepository;
        this.responseRepository = responseRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public QuizDTO createQuiz(QuizDTO quizDTO) {
        Quiz quiz = new Quiz();
        quiz.setTitle(quizDTO.getTitle());
        quiz.setDescription(quizDTO.getDescription());
        quiz.setScore(quizDTO.getScore());
        quiz.setUser(userRepository.findById(quizDTO.getUserId()).orElse(null));
        quiz = quizRepository.save(quiz);
        quizDTO.setId(quiz.getId());
        return quizDTO;
    }

    @Override
    public Optional<QuizDTO> getQuizById(Long id) {
        return quizRepository.findById(id).map(quiz -> new QuizDTO(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getScore(),
                null,
                quiz.getUser() != null ? quiz.getUser().getId() : null
        ));
    }

    @Override
    public List<QuizDTO> getAllQuizzes() {
        return quizRepository.findAll().stream().map(quiz -> new QuizDTO(
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getScore(),
                null,
                quiz.getUser() != null ? quiz.getUser().getId() : null
        )).collect(Collectors.toList());
    }

    @Override
    public QuizDTO updateQuiz(Long id, QuizDTO quizDTO) {
        if (!quizRepository.existsById(id)) {
            return null;
        }

        Quiz quiz = new Quiz();
        quiz.setId(id);
        quiz.setTitle(quizDTO.getTitle());
        quiz.setDescription(quizDTO.getDescription());
        quiz.setScore(quizDTO.getScore());

        if (quizDTO.getUserId() != null) {
            userRepository.findById(quizDTO.getUserId()).ifPresent(quiz::setUser);
        } else {
            quiz.setUser(null);
        }

        quiz = quizRepository.save(quiz);
        quizDTO.setId(quiz.getId());
        return quizDTO;
    }

    @Override
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }

    @Override
    public String analyzePersonality(int score) {
        if (score >= 0 && score <= 10) {
            return "Créatif";
        } else if (score > 10 && score <= 20) {
            return "Sportif";
        } else {
            return "Analyse avancée nécessaire";
        }
    }
}