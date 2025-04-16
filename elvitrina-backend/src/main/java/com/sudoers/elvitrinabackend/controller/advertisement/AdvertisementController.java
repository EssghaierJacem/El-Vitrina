package com.sudoers.elvitrinabackend.controller.advertisement;

import com.sudoers.elvitrinabackend.model.entity.Advertisement;
import com.sudoers.elvitrinabackend.service.Advertisement.AdvertisementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adsss")
public class AdvertisementController {

    @Autowired
    private AdvertisementService advertisementService;

    @PostMapping
    public ResponseEntity<Advertisement> createAdvertisement(@RequestBody Advertisement advertisement) {
        Advertisement savedAd = advertisementService.saveAdvertisement(advertisement);
        return ResponseEntity.ok(savedAd);
    }

    @GetMapping
    public ResponseEntity<List<Advertisement>> getAllAdvertisements() {
        List<Advertisement> ads = advertisementService.getAllAdvertisements();
        return ResponseEntity.ok(ads);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Advertisement> getAdvertisementById(@PathVariable Long id) {
        Advertisement ad = advertisementService.getAdvertisementById(id);
        return ResponseEntity.ok(ad);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Advertisement> updateAdvertisement(@PathVariable Long id, @RequestBody Advertisement advertisement) {
        Advertisement updatedAd = advertisementService.updateAdvertisement(id, advertisement);
        return ResponseEntity.ok(updatedAd);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdvertisement(@PathVariable Long id) {
        advertisementService.deleteAdvertisement(id);
        return ResponseEntity.noContent().build();
    }



}
