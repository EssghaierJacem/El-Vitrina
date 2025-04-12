package com.sudoers.elvitrinabackend.controller.Quiz;

import com.sudoers.elvitrinabackend.model.dto.QuestionDTO;
import com.sudoers.elvitrinabackend.service.Quizz.IQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final IQuestionService questionService;

    @Autowired
    public QuestionController(IQuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public ResponseEntity<QuestionDTO> createQuestion(@RequestBody QuestionDTO questionDTO) {
        QuestionDTO createdQuestion = questionService.createQuestion(questionDTO);
        return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) {
        Optional<QuestionDTO> question = questionService.getQuestionById(id);
        return question.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<QuestionDTO> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<QuestionDTO> updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO questionDTO) {
        QuestionDTO updatedQuestion = questionService.updateQuestion(id, questionDTO);
        return updatedQuestion != null ? ResponseEntity.ok(updatedQuestion)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/byQuiz/{quizId}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByQuiz(@PathVariable Long quizId) {
        List<QuestionDTO> questions = questionService.getQuestionsByQuizId(quizId);
        return ResponseEntity.ok(questions);
    }
}
