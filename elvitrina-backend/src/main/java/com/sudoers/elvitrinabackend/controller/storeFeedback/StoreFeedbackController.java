package com.sudoers.elvitrinabackend.controller.storeFeedback;


import com.sudoers.elvitrinabackend.model.entity.StoreFeedback;
import com.sudoers.elvitrinabackend.service.feedback.storeFeedback.IStoreFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store-feedbacks")
public class StoreFeedbackController {

    @Autowired
    private IStoreFeedbackService storeFeedbackService;

    // Create
    @PostMapping
    public ResponseEntity<StoreFeedback> createStoreFeedback(@RequestBody StoreFeedback storeFeedback) {
        StoreFeedback savedStoreFeedback = storeFeedbackService.saveStoreFeedback(storeFeedback);
        return new ResponseEntity<>(savedStoreFeedback, HttpStatus.CREATED);
    }

    // Read (All)
    @GetMapping
    public ResponseEntity<List<StoreFeedback>> getAllStoreFeedbacks() {
        List<StoreFeedback> storeFeedbacks = storeFeedbackService.getAllStoreFeedbacks();
        return new ResponseEntity<>(storeFeedbacks, HttpStatus.OK);
    }

    // Read (ById)
    @GetMapping("/{id}")
    public ResponseEntity<StoreFeedback> getStoreFeedbackById(@PathVariable Long id) {
        StoreFeedback storeFeedback = storeFeedbackService.getStoreFeedbackById(id);
        return new ResponseEntity<>(storeFeedback, HttpStatus.OK);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<StoreFeedback> updateStoreFeedback(@PathVariable Long id, @RequestBody StoreFeedback storeFeedback) {
        StoreFeedback updatedStoreFeedback = storeFeedbackService.updateStoreFeedback(id, storeFeedback);
        return new ResponseEntity<>(updatedStoreFeedback, HttpStatus.OK);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStoreFeedback(@PathVariable Long id) {
        storeFeedbackService.deleteStoreFeedback(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
