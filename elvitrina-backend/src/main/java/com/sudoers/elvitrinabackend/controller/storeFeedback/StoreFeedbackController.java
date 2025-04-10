package com.sudoers.elvitrinabackend.controller.storeFeedback;

import com.sudoers.elvitrinabackend.model.dto.StoreFeedbackDTO;
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

    @PostMapping
    public ResponseEntity<StoreFeedbackDTO> createStoreFeedback(@RequestBody StoreFeedbackDTO storeFeedbackDTO) {
        StoreFeedbackDTO savedFeedback = storeFeedbackService.saveStoreFeedback(storeFeedbackDTO);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StoreFeedbackDTO>> getAllStoreFeedbacks() {
        List<StoreFeedbackDTO> feedbacks = storeFeedbackService.getAllStoreFeedbacks();
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreFeedbackDTO> getStoreFeedbackById(@PathVariable Long id) {
        StoreFeedbackDTO feedback = storeFeedbackService.getStoreFeedbackById(id);
        return ResponseEntity.ok(feedback);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreFeedbackDTO> updateStoreFeedback(
            @PathVariable Long id,
            @RequestBody StoreFeedbackDTO storeFeedbackDTO) {
        StoreFeedbackDTO updatedFeedback = storeFeedbackService.updateStoreFeedback(id, storeFeedbackDTO);
        return ResponseEntity.ok(updatedFeedback);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStoreFeedback(@PathVariable Long id) {
        storeFeedbackService.deleteStoreFeedback(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/store/{storeId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByStoreId(@PathVariable Long storeId) {
        Double averageRating = storeFeedbackService.getAverageRatingByStoreId(storeId);
        return ResponseEntity.ok(averageRating);
    }

    @GetMapping("/store/{storeId}/count")
    public ResponseEntity<Long> countByStoreId(@PathVariable Long storeId) {
        Long count = storeFeedbackService.countByStoreId(storeId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<StoreFeedbackDTO>> getFeedbacksByStoreId(@PathVariable Long storeId) {
        List<StoreFeedbackDTO> feedbacks = storeFeedbackService.getFeedbacksByStoreId(storeId);
        if (feedbacks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(feedbacks);
    }
}