package com.sudoers.elvitrinabackend.controller.Quiz;

import com.sudoers.elvitrinabackend.model.dto.ResponseDTO;
import com.sudoers.elvitrinabackend.service.Quizz.IResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/responses")
public class ResponseController {

    private final IResponseService responseService;

    @Autowired
    public ResponseController(IResponseService responseService) {
        this.responseService = responseService;
    }

    @PostMapping
    public ResponseEntity<ResponseDTO> createResponse(@RequestBody ResponseDTO responseDTO) {
        ResponseDTO createdResponse = responseService.createResponse(responseDTO);
        return new ResponseEntity<>(createdResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO> getResponseById(@PathVariable Long id) {
        Optional<ResponseDTO> response = responseService.getResponseById(id);
        return response.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping
    public ResponseEntity<List<ResponseDTO>> getAllResponses() {
        List<ResponseDTO> responses = responseService.getAllResponses();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO> updateResponse(@PathVariable Long id, @RequestBody ResponseDTO responseDTO) {
        ResponseDTO updatedResponse = responseService.updateResponse(id, responseDTO);
        return updatedResponse != null ? ResponseEntity.ok(updatedResponse)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResponse(@PathVariable Long id) {
        responseService.deleteResponse(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/submit")
    public ResponseEntity<ResponseDTO> submitResponse(@RequestBody ResponseDTO responseDTO) {
        ResponseDTO submitted = responseService.submitResponse(responseDTO);
        return new ResponseEntity<>(submitted, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResponseDTO>> getResponsesByUserId(@PathVariable Long userId) {
        List<ResponseDTO> responses = responseService.getResponsesByUserId(userId);
        return ResponseEntity.ok(responses);
    }
}
