package com.sudoers.elvitrinabackend.controller.Ad;

import com.sudoers.elvitrinabackend.model.dto.AdReviewRequest;
import com.sudoers.elvitrinabackend.model.entity.Ad;
import com.sudoers.elvitrinabackend.model.enums.AdStatus;
import com.sudoers.elvitrinabackend.repository.AdRepository;
import com.sudoers.elvitrinabackend.service.Ad.AdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;
        import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ads")
public class AdController {

    private final AdService adService;

    public AdController(AdService adService) {
        this.adService = adService;
    }

    @PostMapping
    public ResponseEntity<Ad> createAd(@RequestBody Ad ad) {
        Ad createdAd = adService.createAd(ad);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdAd.getId())
                .toUri();
        return ResponseEntity.created(location).body(createdAd);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ad> getAd(@PathVariable Long id) {
        return ResponseEntity.ok(adService.getAdById(id));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Ad>> getActiveAds() {
        return ResponseEntity.ok(adService.getActiveAds());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Ad>> getPendingAds() {
        return ResponseEntity.ok(adService.getPendingAds());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Ad>> filterAds(
            @RequestParam(required = false) AdStatus status,
            @RequestParam(required = false) String advertiserEmail) {
        return ResponseEntity.ok(adService.filterAds(status, advertiserEmail));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Ad> updateStatus(
            @PathVariable Long id,
            @RequestParam AdStatus status,
            @RequestParam(required = false) String rejectionReason) {
        return ResponseEntity.ok(adService.updateAdStatus(id, status, rejectionReason));
    }

    @PutMapping("/{id}/impression")
    public ResponseEntity<Void> recordImpression(@PathVariable Long id) {
        adService.recordImpression(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/click")
    public ResponseEntity<Void> recordClick(@PathVariable Long id) {
        adService.recordClick(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/{id}")
    public ResponseEntity<Map<String, Integer>> getAdStats(@PathVariable Long id) {
        Ad ad = adService.getAdById(id);
        return ResponseEntity.ok(Map.of(
                "impressions", ad.getImpressions(),
                "clicks", ad.getClicks()
        ));
    }
}