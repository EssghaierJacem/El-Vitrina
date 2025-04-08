package com.sudoers.elvitrinabackend.controller.Gift;

import com.sudoers.elvitrinabackend.model.dto.request.GiftRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.GiftResponseDTO;
import com.sudoers.elvitrinabackend.service.Gift.GiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gifts")
@RequiredArgsConstructor
public class GiftController {

    private final GiftService giftService;

    @PostMapping
    public ResponseEntity<GiftResponseDTO> createGift(@RequestBody GiftRequestDTO dto) {
        return ResponseEntity.ok(giftService.createGift(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GiftResponseDTO> getGift(@PathVariable Long id) {
        return ResponseEntity.ok(giftService.getGiftById(id));
    }

    @GetMapping
    public ResponseEntity<List<GiftResponseDTO>> getAllGifts() {
        return ResponseEntity.ok(giftService.getAllGifts());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGift(@PathVariable Long id) {
        giftService.deleteGift(id);
        return ResponseEntity.noContent().build();
    }
}
