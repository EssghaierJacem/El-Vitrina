package com.sudoers.elvitrinabackend.controller.Recommendation;

import com.sudoers.elvitrinabackend.model.dto.ProductRecommendation;
import com.sudoers.elvitrinabackend.service.RecoService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// RecoController.java
@RestController
@RequestMapping("/api")
public class RecoController {

    private final RecoService recoService;

    public RecoController(RecoService recoService) {
        this.recoService = recoService;
    }

    @PostMapping("/recommend")
    public List<ProductRecommendation> recommend(@RequestBody List<String> responses) {
        return recoService.getRecommendations(responses);
    }
}
