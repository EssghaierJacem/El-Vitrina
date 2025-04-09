package com.sudoers.elvitrinabackend.controller.Gift;

import com.sudoers.elvitrinabackend.model.dto.request.GiftRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.GiftClaimResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.GiftResponseDTO;
import com.sudoers.elvitrinabackend.service.Gift.GiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @GetMapping("/available")
    public ResponseEntity<List<GiftResponseDTO>> getAvailableGifts(
            @RequestParam Long userId) {
        return ResponseEntity.ok(giftService.getAvailableGiftsForUser(userId));
    }

    @PostMapping("/{id}/claim/{donationId}")
    public ResponseEntity<GiftClaimResponseDTO> claimGift(
            @PathVariable("id") Long giftId,
            @PathVariable("donationId") Long donationId,
            @RequestParam Long userId) {
        return ResponseEntity.ok(giftService.claimGift(giftId, donationId, userId));
    }

    @GetMapping("/qrcode/{giftCode}")
    public ResponseEntity<byte[]> getGiftQRCode(@PathVariable String giftCode) {
        byte[] qrCodeImage = giftService.generateGiftQRCode(giftCode);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        return new ResponseEntity<>(qrCodeImage, headers, HttpStatus.OK);
    }

    @PutMapping("/redeem/{giftId}")
    public ResponseEntity<String> redeemGift(@PathVariable Long giftId, @RequestParam Long userId) {
        try {
            giftService.redeemGift(giftId, userId);
            return ResponseEntity.ok("Gift redeemed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/toggle-shared/{giftId}")
    public ResponseEntity<String> toggleGiftShared(@PathVariable Long giftId, @RequestParam Long userId) {
        try {
            // Toggle the isshared value
            giftService.toggleGiftShared(giftId, userId);
            return ResponseEntity.ok("Gift sharing status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
