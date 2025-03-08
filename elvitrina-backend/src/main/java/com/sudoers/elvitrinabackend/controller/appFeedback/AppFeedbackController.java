package com.sudoers.elvitrinabackend.controller.appFeedback;

import com.sudoers.elvitrinabackend.model.entity.AppFeedback;
import com.sudoers.elvitrinabackend.service.feedback.appFeedback.IAppFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-feedbacks")
public class AppFeedbackController {
    @Autowired
    private IAppFeedbackService appFeedbackService;

    // Create
    @PostMapping
    public ResponseEntity<AppFeedback> createAppFeedback(@RequestBody AppFeedback appFeedback) {
        AppFeedback savedAppFeedback = appFeedbackService.saveAppFeedback(appFeedback);
        return new ResponseEntity<>(savedAppFeedback, HttpStatus.CREATED);
    }

    // Read (All)
    @GetMapping
    public ResponseEntity<List<AppFeedback>> getAllAppFeedbacks() {
        List<AppFeedback> appFeedbacks = appFeedbackService.getAllAppFeedbacks();
        return new ResponseEntity<>(appFeedbacks, HttpStatus.OK);
    }

    // Read (ById)
    @GetMapping("/{id}")
    public ResponseEntity<AppFeedback> getAppFeedbackById(@PathVariable Long id) {
        AppFeedback appFeedback = appFeedbackService.getAppFeedbackById(id);
        return new ResponseEntity<>(appFeedback, HttpStatus.OK);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<AppFeedback> updateAppFeedback(@PathVariable Long id, @RequestBody AppFeedback appFeedback) {
        AppFeedback updatedAppFeedback = appFeedbackService.updateAppFeedback(id, appFeedback);
        return new ResponseEntity<>(updatedAppFeedback, HttpStatus.OK);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppFeedback(@PathVariable Long id) {
        appFeedbackService.deleteAppFeedback(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
