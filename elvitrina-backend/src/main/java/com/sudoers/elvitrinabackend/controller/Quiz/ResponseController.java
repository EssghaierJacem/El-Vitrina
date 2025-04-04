package com.sudoers.elvitrinabackend.controller.Quiz;
import com.sudoers.elvitrinabackend.model.entity.Response;
import com.sudoers.elvitrinabackend.service.Quizz.IResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/responses")
public class ResponseController {

    private final IResponseService responseService;

    @Autowired
    public ResponseController(IResponseService responseService) {
        this.responseService = responseService;
    }

    @PostMapping
    public ResponseEntity<Response> createResponse(@RequestBody Response response) {
        Response createdResponse = responseService.createResponse(response);
        return new ResponseEntity<>(createdResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getResponseById(@PathVariable Long id) {
        Optional<Response> response = responseService.getResponseById(id);
        return response.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping
    public ResponseEntity<List<Response>> getAllResponses() {
        List<Response> responses = responseService.getAllResponses();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response> updateResponse(@PathVariable Long id, @RequestBody Response response) {
        Response updatedResponse = responseService.updateResponse(id, response);
        return updatedResponse != null ? ResponseEntity.ok(updatedResponse)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResponse(@PathVariable Long id) {
        responseService.deleteResponse(id);
        return ResponseEntity.noContent().build();
    }
}
