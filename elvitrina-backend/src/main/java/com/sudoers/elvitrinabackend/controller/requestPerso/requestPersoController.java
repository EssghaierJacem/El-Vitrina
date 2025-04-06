package com.sudoers.elvitrinabackend.controller.requestPerso;
import com.sudoers.elvitrinabackend.model.dto.RequestPersoDTO;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import com.sudoers.elvitrinabackend.service.requestPerso.IRequestPersoService;
import jakarta.persistence.EntityNotFoundException;
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
    UserRepository userRepository;
    @PostMapping
    public ResponseEntity<RequestPerso> createRequestPerso(@RequestBody RequestPersoDTO requestDTO) {
        // Fetch the user from the database
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Convert DTO to entity
        RequestPerso request = new RequestPerso();
        request.setUser(user);
        request.setTitle(requestDTO.getTitle());
        request.setDescription(requestDTO.getDescription());
        request.setMinPrice(requestDTO.getMinPrice());
        request.setMaxPrice(requestDTO.getMaxPrice());
        request.setImage(requestDTO.getImage());
        request.setDeliveryTime(requestDTO.getDeliveryTime());
        request.setViewCount(requestDTO.getViewCount());
        request.setTags(requestDTO.getTags());

        // Save the entity
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
