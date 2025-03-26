package com.sudoers.elvitrinabackend.controller.Creator;

import com.sudoers.elvitrinabackend.model.entity.Creator;
import com.sudoers.elvitrinabackend.service.Creator.CreatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/creators")
public class CreatorController {

    @Autowired
    private CreatorService creatorService;

    @PostMapping
    public ResponseEntity<Creator> createCreator(@RequestBody Creator creator) {
        Creator savedCreator = creatorService.saveCreator(creator);
        return ResponseEntity.ok(savedCreator);
    }

    @GetMapping
    public ResponseEntity<List<Creator>> getAllCreators() {
        List<Creator> creators = creatorService.getAllCreators();
        return ResponseEntity.ok(creators);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Creator> getCreatorById(@PathVariable Long id) {
        Creator creator = creatorService.getCreatorById(id);
        return ResponseEntity.ok(creator);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Creator> updateCreator(@PathVariable Long id, @RequestBody Creator creator) {
        Creator updatedCreator = creatorService.updateCreator(id, creator);
        return ResponseEntity.ok(updatedCreator);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCreator(@PathVariable Long id) {
        creatorService.deleteCreator(id);
        return ResponseEntity.noContent().build();
    }
}