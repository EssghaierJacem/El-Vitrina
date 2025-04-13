package com.sudoers.elvitrinabackend.controller.Quiz;

import com.sudoers.elvitrinabackend.model.dto.QuizDTO;

import com.sudoers.elvitrinabackend.service.Quiz.IQuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final IQuizService quizService;

    @Autowired
    public QuizController(IQuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping
    public ResponseEntity<QuizDTO> createQuiz(@RequestBody QuizDTO quizDTO) {
        QuizDTO createdQuiz = quizService.createQuiz(quizDTO);
        return new ResponseEntity<>(createdQuiz, HttpStatus.CREATED);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long id) {
        Optional<QuizDTO> quiz = quizService.getQuizById(id);
        return quiz.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        List<QuizDTO> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<QuizDTO> updateQuiz(@PathVariable Long id, @RequestBody QuizDTO quizDTO) {
        QuizDTO updatedQuiz = quizService.updateQuiz(id, quizDTO);
        return updatedQuiz != null ? ResponseEntity.ok(updatedQuiz)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

}
