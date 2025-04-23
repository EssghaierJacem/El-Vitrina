package com.sudoers.elvitrinabackend.controller.user;

import com.sudoers.elvitrinabackend.model.entity.Offer;
import com.sudoers.elvitrinabackend.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class RecommendationController {

    private final OfferRepository offerRepository;

    @PostMapping("/suggest-offer")
    public ResponseEntity<String> suggestOffer(@RequestBody Map<String, String> body) {
        try {
            String interests = body.get("interests");

            for (String keyword : interests.split(",")) {
                String trimmed = keyword.trim();
                if (trimmed.isEmpty()) continue;

                List<Offer> matches = offerRepository.findBestMatchingOffers(trimmed);
                if (!matches.isEmpty()) {
                    Offer top = matches.get(0);
                    String message = String.format(
                            "%s: %s (%.0f%% OFF)",
                            top.getName(),
                            top.getDescription(),
                            top.getDiscount()
                    );
                    return ResponseEntity.ok(message);
                }
            }

            return ResponseEntity.ok("We couldn't find a perfect offer, but check out our top deals!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Offer recommendation failed: " + e.getMessage());
        }
    }
}
