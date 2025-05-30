package com.sudoers.elvitrinabackend.controller.requestPerso;
import com.sudoers.elvitrinabackend.model.dto.RequestPersoDTO;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.enums.RequestStatus;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import com.sudoers.elvitrinabackend.service.requestPerso.IRequestPersoService;
import com.sudoers.elvitrinabackend.service.requestPerso.RequestImageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/requestPerso")
@AllArgsConstructor
public class requestPersoController {
 IRequestPersoService requestPersoService;
    UserRepository userRepository;
    RequestImageService requestImageService;
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
        request.setDate(new Date());
        request.setStatus(RequestStatus.ACCEPTED);
        // Save the entity
        RequestPerso createdRequest = requestPersoService.addRequestPerso(request);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }
/*
    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestPersoById(@PathVariable Long id) {
        try {
            RequestPerso request = requestPersoService.getRequestPersoById(id);
            return ResponseEntity.ok(request);
        }

       catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
       }

    }
*/
@GetMapping("/{id}")
public ResponseEntity<?> getRequestPersoById(@PathVariable Long id) {
    try {
        RequestPersoDTO requestPersoDTO = requestPersoService.getRequestPersoByIdd(id);
        return ResponseEntity.ok(requestPersoDTO);
    } catch (EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
}

    @GetMapping
    public List<RequestPersoDTO> getAllRequestPerso() {
        return requestPersoService.getAllRequestPersoDTO();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequestPerso(@PathVariable Long id) {
        requestPersoService.deleteRequestPersoById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateRequestPerso(
            @PathVariable Long id,
            @RequestPart("request") RequestPersoDTO requestDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        try {
            RequestPerso updated;

            if (imageFile != null) {
                // Handle the image upload
                String filename = requestImageService.saveImage(imageFile);
                requestDTO.setImage(filename);
                updated = requestPersoService.updateRequestPerso(id, requestDTO);
            } else {
                // No new image provided, update without changing the image
                updated = requestPersoService.updateRequestPerso(id, requestDTO);
            }

            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process image");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update request");
        }
    }


}
