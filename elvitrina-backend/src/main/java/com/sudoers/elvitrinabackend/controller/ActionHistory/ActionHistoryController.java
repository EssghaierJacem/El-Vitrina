package com.sudoers.elvitrinabackend.controller.ActionHistory;

import com.sudoers.elvitrinabackend.model.entity.ActionHistory;
import com.sudoers.elvitrinabackend.service.ActionHistory.ActionHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")

public class ActionHistoryController {

        @Autowired
        private ActionHistoryService historyService;

        @GetMapping
        public ResponseEntity<List<ActionHistory>> getAllHistory() {
            return ResponseEntity.ok(historyService.getAllActions());
        }
    }

