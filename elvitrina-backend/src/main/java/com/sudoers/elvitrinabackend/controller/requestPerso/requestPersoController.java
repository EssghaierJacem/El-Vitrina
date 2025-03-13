package com.sudoers.elvitrinabackend.controller.requestPerso;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.service.requestPerso.IRequestPersoService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requestPerso")
@AllArgsConstructor
public class requestPersoController {
 IRequestPersoService requestPersoService;
    @PostMapping
    public ResponseEntity<RequestPerso> createRequestPerso(@RequestBody RequestPerso request) {
        RequestPerso createdRequest = requestPersoService.addRequestPerso(request);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestPerso> getRequestPersoById(@PathVariable Long id) {
        RequestPerso request = requestPersoService.getRequestPersoById(id);
        return new ResponseEntity<>(request, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<RequestPerso>> getAllRequestPerso() {
        List<RequestPerso> requests = requestPersoService.getAllRequestPerso();
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RequestPerso> updateRequestPerso(@PathVariable Long id, @RequestBody RequestPerso requestDetails) {
        RequestPerso updatedRequest = requestPersoService.updateRequestPerso(id,requestDetails);
        return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequestPerso(@PathVariable Long id) {
        requestPersoService.deleteRequestPersoById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
