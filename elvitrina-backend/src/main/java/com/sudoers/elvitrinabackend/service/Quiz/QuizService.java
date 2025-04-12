package com.sudoers.elvitrinabackend.service.Quiz;

import com.sudoers.elvitrinabackend.model.dto.QuizDTO;
import com.sudoers.elvitrinabackend.model.entity.Quiz;
import com.sudoers.elvitrinabackend.repository.QuizRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizService implements IQuizService {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    @Autowired
    public QuizService(QuizRepository quizRepository, UserRepository userRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
    }

    @Override
    public QuizDTO createQuiz(QuizDTO quizDTO) {
        Quiz quiz = new Quiz();
        quiz.setQuestion(quizDTO.getQuestion());
        quiz.setOption1(quizDTO.getOption1());
        quiz.setOption2(quizDTO.getOption2());
        quiz.setOption3(quizDTO.getOption3());
        quiz.setBonneReponse(quizDTO.getBonneReponse());
        quiz.setReponseUser(quizDTO.getReponseUser());
        quiz.setScore(quizDTO.getScore());

        if (quizDTO.getUserId() != null) {
            userRepository.findById(quizDTO.getUserId()).ifPresent(quiz::setUser);
        }

        quizRepository.save(quiz);
        return quizDTO;
    }

    @Override
    public Optional<QuizDTO> getQuizById(Long id) {
        return quizRepository.findById(id).map(quiz -> {
            QuizDTO dto = new QuizDTO();
            dto.setQuestion(quiz.getQuestion());
            dto.setOption1(quiz.getOption1());
            dto.setOption2(quiz.getOption2());
            dto.setOption3(quiz.getOption3());
            dto.setBonneReponse(quiz.getBonneReponse());
            dto.setReponseUser(quiz.getReponseUser());
            dto.setScore(quiz.getScore());
            if (quiz.getUser() != null) {
                dto.setUserId(quiz.getUser().getId());
            }
            return dto;
        });
    }

    @Override
    public List<QuizDTO> getAllQuizzes() {
        return quizRepository.findAll().stream().map(quiz -> {
            QuizDTO dto = new QuizDTO();
            dto.setQuestion(quiz.getQuestion());
            dto.setOption1(quiz.getOption1());
            dto.setOption2(quiz.getOption2());
            dto.setOption3(quiz.getOption3());
            dto.setBonneReponse(quiz.getBonneReponse());
            dto.setReponseUser(quiz.getReponseUser());
            dto.setScore(quiz.getScore());
            if (quiz.getUser() != null) {
                dto.setUserId(quiz.getUser().getId());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public QuizDTO updateQuiz(Long id, QuizDTO quizDTO) {
        Optional<Quiz> optionalQuiz = quizRepository.findById(id);
        if (optionalQuiz.isEmpty()) return null;

        Quiz quiz = optionalQuiz.get();
        quiz.setQuestion(quizDTO.getQuestion());
        quiz.setOption1(quizDTO.getOption1());
        quiz.setOption2(quizDTO.getOption2());
        quiz.setOption3(quizDTO.getOption3());
        quiz.setBonneReponse(quizDTO.getBonneReponse());
        quiz.setReponseUser(quizDTO.getReponseUser());
        quiz.setScore(quizDTO.getScore());

        if (quizDTO.getUserId() != null) {
            userRepository.findById(quizDTO.getUserId()).ifPresent(quiz::setUser);
        } else {
            quiz.setUser(null);
        }

        quizRepository.save(quiz);
        return quizDTO;
    }

    @Override
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }

}