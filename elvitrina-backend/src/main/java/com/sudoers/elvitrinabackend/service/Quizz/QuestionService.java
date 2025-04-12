package com.sudoers.elvitrinabackend.service.Quizz;

import com.sudoers.elvitrinabackend.model.dto.QuestionDTO;
import com.sudoers.elvitrinabackend.model.entity.Question;
import com.sudoers.elvitrinabackend.model.entity.Quiz;
import com.sudoers.elvitrinabackend.repository.QuestionRepository;
import com.sudoers.elvitrinabackend.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionService implements IQuestionService {
    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository, QuizRepository quizRepository) {
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
    }

    @Override
    public QuestionDTO createQuestion(QuestionDTO questionDTO) {
        Question question = new Question();
        question.setQuestion(questionDTO.getQuestion());
        question.setQuestionType(questionDTO.getQuestionType());

        Quiz quiz = quizRepository.findById(questionDTO.getQuizId()).orElse(null);
        question.setQuiz(quiz);

        question = questionRepository.save(question);
        questionDTO.setId(question.getId());
        return questionDTO;
    }

    @Override
    public Optional<QuestionDTO> getQuestionById(Long id) {
        return questionRepository.findById(id).map(question -> new QuestionDTO(
                question.getId(),
                question.getQuestion(),
                question.getQuestionType(),
                question.getQuiz() != null ? question.getQuiz().getId() : null,
                null
        ));
    }

    @Override
    public List<QuestionDTO> getAllQuestions() {
        return questionRepository.findAll().stream().map(question -> new QuestionDTO(
                question.getId(),
                question.getQuestion(),
                question.getQuestionType(),
                question.getQuiz() != null ? question.getQuiz().getId() : null,
                null
        )).collect(Collectors.toList());
    }

    @Override
    public QuestionDTO updateQuestion(Long id, QuestionDTO questionDTO) {
        if (!questionRepository.existsById(id)) {
            return null;
        }
        Question question = new Question();
        question.setId(id);
        question.setQuestion(questionDTO.getQuestion());
        question.setQuestionType(questionDTO.getQuestionType());

        Quiz quiz = quizRepository.findById(questionDTO.getQuizId()).orElse(null);
        question.setQuiz(quiz);

        question = questionRepository.save(question);
        return questionDTO;
    }

    @Override
    public List<QuestionDTO> getQuestionsByQuizId(Long quizId) {
        return questionRepository.findByQuizId(quizId).stream().map(question -> new QuestionDTO(
                question.getId(),
                question.getQuestion(),
                question.getQuestionType(),
                quizId,
                null
        )).collect(Collectors.toList());
    }

    @Override
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}