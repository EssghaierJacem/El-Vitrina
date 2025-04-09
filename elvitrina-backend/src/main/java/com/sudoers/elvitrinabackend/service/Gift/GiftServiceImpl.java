package com.sudoers.elvitrinabackend.service.Gift;
import com.sudoers.elvitrinabackend.model.dto.request.GiftRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.GiftResponseDTO;
import com.sudoers.elvitrinabackend.model.mapper.GiftMapper;
import com.sudoers.elvitrinabackend.model.entity.*;
import com.sudoers.elvitrinabackend.repository.*;
import com.sudoers.elvitrinabackend.service.Gift.GiftService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.sudoers.elvitrinabackend.model.dto.request.GiftRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.GiftClaimResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.GiftResponseDTO;
import com.sudoers.elvitrinabackend.model.mapper.GiftMapper;
import com.sudoers.elvitrinabackend.model.entity.*;
import com.sudoers.elvitrinabackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class GiftServiceImpl implements GiftService {

    private final GiftRepository giftRepository;
    private final DonationRepository donationRepository;
    private final DonorRewardRepository donorRewardRepository;
    private final UserRepository userRepository;
    private final GiftMapper giftMapper;

    @Override
    public GiftResponseDTO createGift(GiftRequestDTO dto) {
        Donation donation = donationRepository.findById(dto.getDonationId())
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        DonorReward reward = null;
        if (dto.getRewardId() != null) {
            reward = donorRewardRepository.findById(dto.getRewardId())
                    .orElseThrow(() -> new RuntimeException("Reward not found"));
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Gift gift = giftMapper.toEntity(dto, donation, reward, user);
        return giftMapper.toDto(giftRepository.save(gift));
    }

    @Override
    public GiftResponseDTO getGiftById(Long id) {
        return giftRepository.findById(id)
                .map(giftMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Gift not found"));
    }

    @Override
    public List<GiftResponseDTO> getAllGifts() {
        return giftRepository.findAll()
                .stream()
                .map(giftMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteGift(Long id) {
        giftRepository.deleteById(id);
    }


    @Override
    public List<GiftResponseDTO> getAvailableGiftsForUser(Long userId) {
        // Fetch the user, if not found throw an exception
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch available gifts for the user that are not redeemed
        List<Gift> availableGifts = giftRepository.findByUserAndIsRedeemedFalse(user);

        // Return the mapped gifts in a DTO form
        return availableGifts.stream()
                .map(gift -> {
                    // Create the response DTO
                    GiftResponseDTO dto = new GiftResponseDTO();

                    // Set gift details
                    dto.setName(gift.getName());
                    dto.setDescription(gift.getDescription());
                    dto.setImageUrl(gift.getImageUrl());
                    dto.setGiftCode(gift.getGiftCode());
                    dto.setGiftId(gift.getGiftId());
                    dto.setDonationId(gift.getDonation().getDonationId());

                    // Get the DonorReward related to the gift and set the reward details
                    DonorReward donorReward = gift.getDonorReward();
                    if (donorReward != null) {
                        dto.setRewardId(donorReward.getRewardId());
                        dto.setImageUrl(donorReward.getImageUrl()); // Assuming DonorReward has an image URL field
                    }

                    // Set the redemption status
                    dto.setIsRedeemed(gift.getIsRedeemed());

                    // Optionally, add userId if needed
                    dto.setUserId(user.getId());

                    return dto;
                })
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public GiftClaimResponseDTO claimGift(Long giftId, Long donationId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (!donation.getUser().getId().equals(userId)) {
            throw new RuntimeException("This donation does not belong to the user");
        }



        // Check if donation has already been used to claim a gift
        if (giftRepository.existsByDonation(donation)) {
            throw new RuntimeException("This donation has already been used to claim a gift");
        }

        DonorReward reward = donorRewardRepository.findById(giftId)
                .orElseThrow(() -> new RuntimeException("Gift not found"));

        if (donation.getAmount() < reward.getMinimumDonationAmount()) {
            throw new RuntimeException("This donation does not qualify for the selected gift");
        }

        if (reward.getAvailableQuantity() <= 0) {
            throw new RuntimeException("This gift is out of stock");
        }

        Gift gift = Gift.builder()
                .name(reward.getTitle())
                .description(reward.getDescription())
                .imageUrl(reward.getImageUrl())
                .donation(donation)
                .donorReward(reward)
                .user(user)
                .isRedeemed(false)
                .build();

        reward.setAvailableQuantity(reward.getAvailableQuantity() - 1);
        donorRewardRepository.save(reward);

        // Save the gift
        Gift savedGift = giftRepository.save(gift);

        // Generate QR code
        byte[] qrCode = generateGiftQRCode(savedGift.getGiftCode());

        // Create response
        GiftClaimResponseDTO response = new GiftClaimResponseDTO();
        response.setGift(giftMapper.toDto(savedGift));
        response.setQrCode(qrCode);
        response.setGiftCode(savedGift.getGiftCode());

        return response;
    }

    @Override
    public byte[] generateGiftQRCode(String giftCode) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(giftCode, BarcodeFormat.QR_CODE, 250, 250);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            return outputStream.toByteArray();
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Error generating QR code", e);
        }
    }

    @Override
    public void redeemGift(Long giftId, Long userId) {
        // Find the gift by ID
        Gift gift = giftRepository.findById(giftId)
                .orElseThrow(() -> new RuntimeException("Gift not found"));

        // Check if the gift is already redeemed
        if (gift.getIsRedeemed()) {
            throw new RuntimeException("Gift has already been redeemed");
        }

        // Ensure the gift belongs to the user
        if (!gift.getUser().getId().equals(userId)) {
            throw new RuntimeException("This gift does not belong to the user");
        }

        // Update the isRedeemed field to true
        gift.setIsRedeemed(true);

        // Save the updated gift
        giftRepository.save(gift);
    }

    @Override
    public void toggleGiftShared(Long giftId, Long userId) {
        // Find the gift by ID
        Gift gift = giftRepository.findById(giftId)
                .orElseThrow(() -> new RuntimeException("Gift not found"));

        // Ensure the gift belongs to the user
        if (!gift.getUser().getId().equals(userId)) {
            throw new RuntimeException("This gift does not belong to the user");
        }

        // Toggle the isshared field
        gift.setIsshared(!gift.getIsshared());

        // Save the updated gift
        giftRepository.save(gift);
    }
}