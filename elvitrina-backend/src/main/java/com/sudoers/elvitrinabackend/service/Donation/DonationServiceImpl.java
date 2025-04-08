package com.sudoers.elvitrinabackend.service.Donation;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.request.DonationRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.Donation;
import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;
import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.mapper.DonationMapper;
import com.sudoers.elvitrinabackend.repository.DonationCampaignRepository;
import com.sudoers.elvitrinabackend.repository.DonationRepository;
import com.sudoers.elvitrinabackend.repository.DonorRewardRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sudoers.elvitrinabackend.model.dto.response.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;
    private final DonationMapper donationMapper;
    private final DonationCampaignRepository donationCampaignRepository;
    private final UserRepository userRepository;
    private final DonorRewardRepository donorRewardRepository;

    @Autowired
    public DonationServiceImpl(DonationRepository donationRepository,
                               DonationMapper donationMapper,
                               DonationCampaignRepository donationCampaignRepository,
                               UserRepository userRepository,
                               DonorRewardRepository donorRewardRepository) {
        this.donationRepository = donationRepository;
        this.donationMapper = donationMapper;
        this.donationCampaignRepository = donationCampaignRepository;
        this.userRepository = userRepository;
        this.donorRewardRepository = donorRewardRepository;
    }

    @Override
    @Transactional
    public DonationResponseDTO saveDonation(DonationRequestDTO requestDTO) {
        Donation donation = donationMapper.toEntity(requestDTO);
        donation.setCreatedAt(LocalDateTime.now());

        if (requestDTO.getCampaignId() != null) {
            DonationCampaign campaign = donationCampaignRepository.findById(requestDTO.getCampaignId())
                    .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + requestDTO.getCampaignId()));
            donation.setDonationCampaign(campaign);
        }

        if (requestDTO.getUserId() != null) {
            User user = userRepository.findById(requestDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));
            donation.setUser(user);
        }



        Donation savedDonation = donationRepository.save(donation);
        return donationMapper.toResponseDTO(savedDonation);
    }

    @Override
    public List<DonationResponseDTO> getAllDonations() {
        return donationRepository.findAll().stream()
                .map(donationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DonationResponseDTO getDonationById(Long id) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));
        return donationMapper.toResponseDTO(donation);
    }

    @Override
    @Transactional
    public void deleteDonation(Long id) {
        if (!donationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Donation not found with id: " + id);
        }
        donationRepository.deleteById(id);
    }

    @Override
    @Transactional
    public DonationResponseDTO updateDonation(Long id, DonationRequestDTO requestDTO) {
        Donation existingDonation = donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found with id: " + id));

        donationMapper.updateEntityFromDTO(requestDTO, existingDonation);
        existingDonation.setUpdatedAt(LocalDateTime.now());

        if (requestDTO.getCampaignId() != null) {
            DonationCampaign campaign = donationCampaignRepository.findById(requestDTO.getCampaignId())
                    .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + requestDTO.getCampaignId()));
            existingDonation.setDonationCampaign(campaign);
        }

        if (requestDTO.getUserId() != null) {
            User user = userRepository.findById(requestDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));
            existingDonation.setUser(user);
        }


        Donation updatedDonation = donationRepository.save(existingDonation);
        return donationMapper.toResponseDTO(updatedDonation);
    }

    @Override
    public Page<DonationResponseDTO> getDonationsPaginated(Pageable pageable) {
        return donationRepository.findAll(pageable)
                .map(donationMapper::toResponseDTO);
    }

    @Override
    public List<DonationResponseDTO> getDonationsByCampaignId(Long campaignId) {
        if (!donationCampaignRepository.existsById(campaignId)) {
            throw new ResourceNotFoundException("Campaign not found with id: " + campaignId);
        }

        return donationRepository.findByDonationCampaignCampaignId(campaignId).stream()
                .map(donationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DonationAnalyticsResponseDTO getDonationAnalytics() {
        List<Donation> allDonations = donationRepository.findAll();

        // Calculate total donation amount
        double totalAmount = allDonations.stream()
                .mapToDouble(Donation::getAmount)
                .sum();

        // Count donations
        long totalDonations = allDonations.size();

        // Count anonymous donations
        long anonymousDonations = allDonations.stream()
                .filter(d -> d.getAnonymitySetting() != null && d.getAnonymitySetting())
                .count();

        // Calculate average donation amount
        double avgDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

        // Count unique donors
        long uniqueDonors = allDonations.stream()
                .filter(d -> d.getUser() != null)
                .map(d -> d.getUser().getId())
                .distinct()
                .count();

        // Get donation trends by month
        Map<String, BigDecimal> donationTrends = getDonationTrendsByMonth();

        return DonationAnalyticsResponseDTO.builder()
                .totalDonationAmount(BigDecimal.valueOf(totalAmount))
                .totalDonationCount(totalDonations)
                .anonymousDonationCount(anonymousDonations)
                .averageDonationAmount(BigDecimal.valueOf(avgDonation))
                .uniqueDonorCount(uniqueDonors)
                .donationTrendsByMonth(donationTrends)
                .build();
    }

   /* @Override
    public List<TopDonorResponseDTO> getTopDonors(Long campaignId, String timePeriod) {
        List<Donation> filteredDonations;

        // Filter by campaign if provided
        if (campaignId != null) {
            filteredDonations = donationRepository.findByDonationCampaignCampaignId(campaignId);
        } else {
            filteredDonations = donationRepository.findAll();
        }

        // Filter by time period if provided
        if (timePeriod != null) {
            LocalDateTime startDate = calculateStartDateFromTimePeriod(timePeriod);
            if (startDate != null) {
                final LocalDateTime finalStartDate = startDate;
                filteredDonations = filteredDonations.stream()
                        .filter(d -> d.getCreatedAt().isAfter(finalStartDate))
                        .collect(Collectors.toList());
            }
        }

        // Group donations by user and calculate total amount
        Map<User, Double> donationsByUser = new HashMap<>();
        for (Donation donation : filteredDonations) {
            if (donation.getUser() != null && !donation.getAnonymitySetting()) {
                User user = donation.getUser();
                donationsByUser.put(user, donationsByUser.getOrDefault(user, 0.0) + donation.getAmount());
            }
        }

        // Convert to DTOs and sort by total amount
        List<TopDonorResponseDTO> topDonors = donationsByUser.entrySet().stream()
                .map(entry -> TopDonorResponseDTO.builder()
                        .userId(entry.getKey().getId())
                        .username(entry.getKey().getUsername())
                        .totalDonationAmount(BigDecimal.valueOf(entry.getValue()))
                        .donationCount(filteredDonations.stream()
                                .filter(d -> d.getUser() != null && d.getUser().getId().equals(entry.getKey().getId()))
                                .count())
                        .build())
                .sorted(Comparator.comparing(TopDonorResponseDTO::getTotalDonationAmount).reversed())
                .limit(10) // Get top 10 donors
                .collect(Collectors.toList());

        return topDonors;
    }
*/
   @Override
   public List<TopDonorResponseDTO> getTopDonors(Long campaignId, String timePeriod) {
       // Get initial donations based on campaign filter
       List<Donation> initialDonations = campaignId != null ?
               donationRepository.findByDonationCampaignCampaignId(campaignId) :
               donationRepository.findAll();

       // Apply time period filter if specified
       List<Donation> filteredDonations = timePeriod != null ?
               filterDonationsByTimePeriod(initialDonations, timePeriod) :
               initialDonations;

       // Group donations by user and calculate total amount
       Map<User, Double> donationsByUser = new HashMap<>();
       for (Donation donation : filteredDonations) {
           if (donation.getUser() != null && !donation.getAnonymitySetting()) {
               User user = donation.getUser();
               donationsByUser.put(user, donationsByUser.getOrDefault(user, 0.0) + donation.getAmount());
           }
       }

       // Convert to DTOs and sort by total amount
       return donationsByUser.entrySet().stream()
               .map(entry -> createTopDonorDTO(entry, filteredDonations))
               .sorted(Comparator.comparing(TopDonorResponseDTO::getTotalDonationAmount).reversed())
               .limit(10)
               .collect(Collectors.toList());
   }

    // Helper method to filter donations by time period
    private List<Donation> filterDonationsByTimePeriod(List<Donation> donations, String timePeriod) {
        LocalDateTime startDate = calculateStartDateFromTimePeriod(timePeriod);
        if (startDate == null) {
            return donations;
        }
        return donations.stream()
                .filter(d -> d.getCreatedAt().isAfter(startDate))
                .collect(Collectors.toList());
    }

    // Helper method to create DTO
    private TopDonorResponseDTO createTopDonorDTO(Map.Entry<User, Double> entry, List<Donation> allDonations) {
        User user = entry.getKey();
        long donationCount = allDonations.stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(user.getId()))
                .count();

        return TopDonorResponseDTO.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .totalDonationAmount(BigDecimal.valueOf(entry.getValue()))
                .donationCount(donationCount)
                .build();
    }


    @Override
    public StoreDonationInsightsDTO getStoreDonationInsights(Long storeId) {
        List<Donation> storeDonations = donationRepository.findByStoreStoreId(storeId);

        // Calculate total donation amount for the store
        double totalAmount = storeDonations.stream()
                .mapToDouble(Donation::getAmount)
                .sum();

        // Count donations for the store
        long totalDonations = storeDonations.size();

        // Calculate average donation amount for the store
        double avgDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

        // Count unique donors for the store
        long uniqueDonors = storeDonations.stream()
                .filter(d -> d.getUser() != null)
                .map(d -> d.getUser().getId())
                .distinct()
                .count();

        // Group donations by campaign
        Map<String, BigDecimal> donationsByCampaign = storeDonations.stream()
                .filter(d -> d.getDonationCampaign() != null)
                .collect(Collectors.groupingBy(
                        d -> d.getDonationCampaign().getTitle(),
                        Collectors.reducing(BigDecimal.ZERO,
                                d -> BigDecimal.valueOf(d.getAmount()),
                                BigDecimal::add)
                ));

        return StoreDonationInsightsDTO.builder()
                .storeId(storeId)
                .totalDonationAmount(BigDecimal.valueOf(totalAmount))
                .totalDonationCount(totalDonations)
                .averageDonationAmount(BigDecimal.valueOf(avgDonation))
                .uniqueDonorCount(uniqueDonors)
                .donationsByCampaign(donationsByCampaign)
                .build();
    }

    @Override
    public List<DonationReceiptDTO> getStoreDonationReceipts(Long storeId) {
        List<Donation> storeDonations = donationRepository.findByStoreStoreId(storeId);

        return storeDonations.stream()
                .map(donation -> DonationReceiptDTO.builder()
                        .donationId(donation.getDonationId())
                        .amount(BigDecimal.valueOf(donation.getAmount()))
                        .donationDate(donation.getCreatedAt())
                        .campaignTitle(donation.getDonationCampaign() != null ?
                                donation.getDonationCampaign().getTitle() : "General Donation")
                        .donorName(getDonorName(donation))
                        .donorEmail(getDonorEmail(donation))
                        .message(donation.getDonorMessage())
                        .receiptNumber(generateReceiptNumber(donation))
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<DonationHistoryDTO> getDonationHistory(Long userId, Long campaignId, String startDate, String endDate) {
        List<Donation> userDonations = donationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        // Filter by campaign if provided
        if (campaignId != null) {
            userDonations = userDonations.stream()
                    .filter(d -> d.getDonationCampaign() != null &&
                            d.getDonationCampaign().getCampaignId().equals(campaignId))
                    .collect(Collectors.toList());
        }

        // Filter by date range if provided
        if (startDate != null && endDate != null) {
            LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
            LocalDateTime end = LocalDate.parse(endDate).atTime(23, 59, 59);

            userDonations = userDonations.stream()
                    .filter(d -> d.getCreatedAt().isAfter(start) && d.getCreatedAt().isBefore(end))
                    .collect(Collectors.toList());
        }

        return userDonations.stream()
                .map(donation -> DonationHistoryDTO.builder()
                        .donationId(donation.getDonationId())
                        .amount(BigDecimal.valueOf(donation.getAmount()))
                        .donationDate(donation.getCreatedAt())
                        .campaignId(donation.getDonationCampaign() != null ?
                                donation.getDonationCampaign().getCampaignId() : null)
                        .campaignTitle(donation.getDonationCampaign() != null ?
                                donation.getDonationCampaign().getTitle() : "General Donation")
                        .message(donation.getDonorMessage())
                        .isAnonymous(donation.getAnonymitySetting())
                        .rewardInfo(donation.getGift() != null && donation.getGift().getDonorReward() != null ?
                                RewardInfoDTO.builder()
                                        .rewardId(donation.getGift().getDonorReward().getRewardId())
                                        .rewardTitle(donation.getGift().getDonorReward().getTitle())
                                        .redemptionStatus(donation.getGift().getDonorReward().getRedemptionStatus())
                                        .build() : null)
                        .build())
                .collect(Collectors.toList());
    }

    // Helper methods
    private Map<String, BigDecimal> getDonationTrendsByMonth() {
        List<Donation> allDonations = donationRepository.findAll();
        Map<String, BigDecimal> trends = new TreeMap<>(); // TreeMap to keep months in order

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        allDonations.forEach(donation -> {
            String month = donation.getCreatedAt().format(formatter);
            BigDecimal amount = BigDecimal.valueOf(donation.getAmount());
            trends.put(month, trends.getOrDefault(month, BigDecimal.ZERO).add(amount));
        });

        return trends;
    }

    private LocalDateTime calculateStartDateFromTimePeriod(String timePeriod) {
        LocalDateTime now = LocalDateTime.now();

        switch (timePeriod.toLowerCase()) {
            case "day":
                return now.minusDays(1);
            case "week":
                return now.minusWeeks(1);
            case "month":
                return now.minusMonths(1);
            case "quarter":
                return now.minusMonths(3);
            case "year":
                return now.minusYears(1);
            default:
                return null;
        }
    }

    private String getDonorName(Donation donation) {
        if (donation.getAnonymitySetting() != null && donation.getAnonymitySetting()) {
            return "Anonymous Donor";
        }

        if (donation.getUser() != null) {
            return donation.getUser().getFirstname() + " " + donation.getUser().getLastname();
        }

        return "Unknown Donor";
    }

    private String getDonorEmail(Donation donation) {
        if (donation.getAnonymitySetting() != null && donation.getAnonymitySetting()) {
            return "anonymous@donor.com";
        }

        if (donation.getUser() != null) {
            return donation.getUser().getEmail();
        }

        return "unknown@donor.com";
    }

    private String generateReceiptNumber(Donation donation) {
        // Create a receipt number format: RCPT-{YEAR}-{DONATION_ID}
        return "RCPT-" +
                donation.getCreatedAt().getYear() +
                "-" +
                String.format("%06d", donation.getDonationId());
    }
}
