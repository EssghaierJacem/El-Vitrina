package com.sudoers.elvitrinabackend.controller.appFeedback;

import com.sudoers.elvitrinabackend.model.dto.AppFeedbackDTO;
import com.sudoers.elvitrinabackend.service.feedback.appFeedback.IAppFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/app-feedbacks")
public class AppFeedbackController {

    @Autowired
    private IAppFeedbackService appFeedbackService;

    @PostMapping
    public ResponseEntity<AppFeedbackDTO> createAppFeedback(@RequestBody AppFeedbackDTO appFeedbackDTO) {
        AppFeedbackDTO savedFeedback = appFeedbackService.saveAppFeedback(appFeedbackDTO);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<AppFeedbackDTO>> getAllAppFeedbacks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String searchTerm) {
        Page<AppFeedbackDTO> feedbacks = appFeedbackService.getAllAppFeedbacks(page, size, searchTerm);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppFeedbackDTO> getAppFeedbackById(@PathVariable Long id) {
        AppFeedbackDTO feedback = appFeedbackService.getAppFeedbackById(id);
        return ResponseEntity.ok(feedback);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppFeedbackDTO> updateAppFeedback(
            @PathVariable Long id,
            @RequestBody AppFeedbackDTO appFeedbackDTO) {
        AppFeedbackDTO updatedFeedback = appFeedbackService.updateAppFeedback(id, appFeedbackDTO);
        return ResponseEntity.ok(updatedFeedback);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppFeedback(@PathVariable Long id) {
        appFeedbackService.deleteAppFeedback(id);
        return ResponseEntity.noContent().build();
    }
}