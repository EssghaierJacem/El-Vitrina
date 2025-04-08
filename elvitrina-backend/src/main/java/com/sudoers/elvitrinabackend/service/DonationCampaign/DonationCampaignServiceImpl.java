package com.sudoers.elvitrinabackend.service.DonationCampaign;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.request.CampaignExtensionRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.CampaignStatusRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.request.DonationCampaignRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.CampaignAnalyticsResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.CampaignProgressResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.CampaignReportResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.response.DonationCampaignResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.Donation;
import com.sudoers.elvitrinabackend.model.entity.DonationCampaign;
import com.sudoers.elvitrinabackend.model.entity.DonorReward;
import com.sudoers.elvitrinabackend.model.entity.Store;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.mapper.DonationCampaignMapper;
import com.sudoers.elvitrinabackend.model.mapper.DonorRewardMapper;
import com.sudoers.elvitrinabackend.repository.DonationCampaignRepository;
import com.sudoers.elvitrinabackend.repository.DonationRepository;
import com.sudoers.elvitrinabackend.repository.DonorRewardRepository;
import com.sudoers.elvitrinabackend.repository.StoreRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
public class DonationCampaignServiceImpl implements DonationCampaignService {

    private final DonationCampaignRepository donationCampaignRepository;
    private final DonationCampaignMapper donationCampaignMapper;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final DonorRewardRepository donorRewardRepository;
    private final DonorRewardMapper donorRewardMapper;
    private final DonationRepository donationRepository;

    @Autowired
    public DonationCampaignServiceImpl(DonationCampaignRepository donationCampaignRepository,
                                       DonationCampaignMapper donationCampaignMapper,
                                       UserRepository userRepository,
                                       StoreRepository storeRepository,
                                       DonorRewardRepository donorRewardRepository,
                                       DonorRewardMapper donorRewardMapper,
                                       DonationRepository donationRepository) {
        this.donationCampaignRepository = donationCampaignRepository;
        this.donationCampaignMapper = donationCampaignMapper;
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.donorRewardRepository = donorRewardRepository;
        this.donorRewardMapper = donorRewardMapper;
        this.donationRepository = donationRepository;
    }


    @Override
    public DonationCampaignResponseDTO save(DonationCampaignRequestDTO requestDTO) {
        DonationCampaign campaign = donationCampaignMapper.toEntity(requestDTO);
        campaign.setCreatedAt(LocalDateTime.now());

        campaign.setUser(getUserIfExists(requestDTO.getUserId()));
        campaign.setStore(getStoreIfExists(requestDTO.getStoreId()));
        campaign.setRewards(getMappedRewards(requestDTO, campaign));

        return donationCampaignMapper.toResponseDTO(donationCampaignRepository.save(campaign));
    }

    @Override
    public List<DonationCampaignResponseDTO> getAll() {
        return donationCampaignRepository.findAll().stream()
                .map(donationCampaignMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DonationCampaignResponseDTO getById(Long id) {
        DonationCampaign campaign = donationCampaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation campaign not found with id: " + id));
        return donationCampaignMapper.toResponseDTO(campaign);
    }

    @Override
    public void delete(Long id) {
        if (!donationCampaignRepository.existsById(id)) {
            throw new ResourceNotFoundException("Donation campaign not found with id: " + id);
        }
        donationCampaignRepository.deleteById(id);
    }

    @Override
    public DonationCampaignResponseDTO update(Long id, DonationCampaignRequestDTO requestDTO) {
        DonationCampaign existing = donationCampaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation campaign not found with id: " + id));

        donationCampaignMapper.updateEntity(requestDTO, existing);
        existing.setUpdatedAt(LocalDateTime.now());
        existing.setUser(getUserIfExists(requestDTO.getUserId()));
        existing.setStore(getStoreIfExists(requestDTO.getStoreId()));


        return donationCampaignMapper.toResponseDTO(donationCampaignRepository.save(existing));
    }

    @Override
    public Page<DonationCampaignResponseDTO> getPaginated(Pageable pageable) {
        return donationCampaignRepository.findAll(pageable)
                .map(donationCampaignMapper::toResponseDTO);
    }

    @Override
    public List<DonationCampaignResponseDTO> getActive() {
        return donationCampaignRepository
                .findByStatusAndEndDateAfter("ACTIVE", LocalDateTime.now())
                .stream()
                .map(donationCampaignMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // --- Private Utility Methods ---

    private User getUserIfExists(Long userId) {
        return userId != null ? userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId)) : null;
    }

    private Store getStoreIfExists(Long storeId) {
        return storeId != null ? storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId)) : null;
    }

    private List<DonorReward> getMappedRewards(DonationCampaignRequestDTO requestDTO, DonationCampaign campaign) {
        if (requestDTO.getRewards() == null || requestDTO.getRewards().isEmpty()) {
            return new ArrayList<>();
        }

        return requestDTO.getRewards().stream()
                .map(donorRewardMapper::toEntity)
                .peek(reward -> reward.setCampaign(campaign))
                .collect(Collectors.toList());
    }

    // Admin functions
    @Override
    public DonationCampaignResponseDTO updateStatus(Long id, CampaignStatusRequestDTO statusRequest) {
        DonationCampaign campaign = donationCampaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation campaign not found with id: " + id));

        campaign.setStatus(statusRequest.getStatus());

        if (statusRequest.getFeatured() != null) {
            campaign.setFeatured(statusRequest.getFeatured());
        }

        if (statusRequest.getVerified() != null) {
            campaign.setVerified(statusRequest.getVerified());
        }

        campaign.setUpdatedAt(LocalDateTime.now());

        return donationCampaignMapper.toResponseDTO(donationCampaignRepository.save(campaign));
    }

    @Override
    public CampaignAnalyticsResponseDTO getPlatformAnalytics() {
        // Get overall platform stats
        long totalCampaigns = donationCampaignRepository.count();

        List<DonationCampaign> allCampaigns = donationCampaignRepository.findAll();

        double totalRaised = allCampaigns.stream()
                .mapToDouble(DonationCampaign::getCurrentAmount)
                .sum();

        double averageGoalAmount = allCampaigns.stream()
                .mapToDouble(DonationCampaign::getGoal)
                .average()
                .orElse(0.0);

        long successfulCampaigns = allCampaigns.stream()
                .filter(c -> c.getCurrentAmount() >= c.getGoal())
                .count();

        double successRate = totalCampaigns > 0 ?
                (double) successfulCampaigns / totalCampaigns * 100 : 0.0;

        // Get campaigns by category/cause
        Map<String, Long> campaignsByCause = allCampaigns.stream()
                .collect(Collectors.groupingBy(
                        campaign -> campaign.getCause() != null ? campaign.getCause() : "Uncategorized",
                        Collectors.counting()
                ));

        // Get average donation amount
        Double averageDonationAmount = donationRepository.findAverageDonationAmount();

        return CampaignAnalyticsResponseDTO.builder()
                .totalCampaigns(totalCampaigns)
                .totalRaised(totalRaised)
                .averageGoalAmount(averageGoalAmount)
                .successfulCampaigns(successfulCampaigns)
                .successRate(successRate)
                .campaignsByCause(campaignsByCause)
                .averageDonationAmount(averageDonationAmount != null ? averageDonationAmount : 0.0)
                .build();
    }

    // Store owner/seller functions
    @Override
    public List<DonationCampaignResponseDTO> getCampaignsByStore(Long storeId) {
        if (!storeRepository.existsById(storeId)) {
            throw new ResourceNotFoundException("Store not found with id: " + storeId);
        }

        return donationCampaignRepository.findByStoreStoreId(storeId).stream()
                .map(donationCampaignMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DonationCampaignResponseDTO extendCampaign(Long id, CampaignExtensionRequestDTO extensionRequest) {
        DonationCampaign campaign = donationCampaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation campaign not found with id: " + id));

        // Validate extension request
        if (campaign.getEndDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot extend a campaign that has already ended");
        }

        if (extensionRequest.getNewEndDate() != null &&
                extensionRequest.getNewEndDate().isAfter(campaign.getEndDate())) {
            campaign.setEndDate(extensionRequest.getNewEndDate());
        } else if (extensionRequest.getAdditionalDays() != null && extensionRequest.getAdditionalDays() > 0) {
            campaign.setEndDate(campaign.getEndDate().plusDays(extensionRequest.getAdditionalDays()));
        } else {
            throw new IllegalArgumentException("Either new end date or additional days must be provided");
        }

        campaign.setUpdatedAt(LocalDateTime.now());

        return donationCampaignMapper.toResponseDTO(donationCampaignRepository.save(campaign));
    }

    @Override
    public CampaignReportResponseDTO getStoreCampaignReport(Long storeId) {
        if (!storeRepository.existsById(storeId)) {
            throw new ResourceNotFoundException("Store not found with id: " + storeId);
        }

        List<DonationCampaign> storeCampaigns = donationCampaignRepository.findByStoreStoreId(storeId);

        double totalRaised = storeCampaigns.stream()
                .mapToDouble(DonationCampaign::getCurrentAmount)
                .sum();

        long donorCount = storeCampaigns.stream()
                .flatMap(campaign -> campaign.getDonations() != null ? campaign.getDonations().stream() : Stream.empty())
                .map(Donation::getUser)
                .distinct()
                .count();

        long completedCampaigns = storeCampaigns.stream()
                .filter(c -> "COMPLETED".equals(c.getStatus()))
                .count();

        long activeCampaigns = storeCampaigns.stream()
                .filter(c -> "ACTIVE".equals(c.getStatus()))
                .count();

        // Calculate ROI - assuming there's cost data associated with campaigns
        // This is a simplified example - adjust according to your actual data model
        double campaignInvestment = storeCampaigns.stream()
                .mapToDouble(c -> c.getCampaignCost() != null ? c.getCampaignCost() : 0.0)
                .sum();

        double roi = campaignInvestment > 0 ? (totalRaised - campaignInvestment) / campaignInvestment * 100 : 0.0;

        // Get campaigns performance by time
        Map<String, Double> monthlyPerformance = new HashMap<>();
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);

        for (DonationCampaign campaign : storeCampaigns) {
            if (campaign.getCreatedAt().isAfter(sixMonthsAgo)) {
                String monthYear = campaign.getCreatedAt().getMonth() + " " + campaign.getCreatedAt().getYear();
                monthlyPerformance.merge(monthYear, campaign.getCurrentAmount(), Double::sum);
            }
        }

        return CampaignReportResponseDTO.builder()
                .storeId(storeId)
                .totalCampaigns(storeCampaigns.size())
                .totalRaised(totalRaised)
                .donorCount(donorCount)
                .completedCampaigns(completedCampaigns)
                .activeCampaigns(activeCampaigns)
                .roi(roi)
                .monthlyPerformance(monthlyPerformance)
                .build();
    }

    // Regular user functions
    @Override
    public Page<DonationCampaignResponseDTO> filterCampaigns(
            String title, String cause, Double minGoal, Double maxGoal,
            String status, String sortBy, Pageable pageable) {

        // Build specification based on filter criteria
        Specification<DonationCampaign> spec = Specification.where(null);

        if (title != null && !title.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
        }

        if (cause != null && !cause.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("cause"), cause));
        }

        if (minGoal != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("goal"), minGoal));
        }

        if (maxGoal != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("goal"), maxGoal));
        }

        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), status));
        } else {
            // Default to showing active campaigns
            spec = spec.and((root, query, cb) ->
                    cb.and(
                            cb.equal(root.get("status"), "ACTIVE"),
                            cb.greaterThan(root.get("endDate"), LocalDateTime.now())
                    ));
        }

        // Apply sorting based on sortBy parameter
        Sort sort;
        if ("endingSoon".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "endDate");
        } else if ("mostFunded".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "currentAmount");
        } else if ("newest".equals(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        } else {
            // Default sorting by relevance (featured first, then by creation date)
            sort = Sort.by(
                    Sort.Order.desc("featured"),
                    Sort.Order.desc("createdAt")
            );
        }

        // Apply sort to pageable if not already present
        Pageable sortedPageable = pageable.getSort().isSorted() ?
                pageable : PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        Page<DonationCampaign> campaignsPage = donationCampaignRepository.findAll(spec, sortedPageable);

        return campaignsPage.map(donationCampaignMapper::toResponseDTO);
    }


    @Override
    public CampaignProgressResponseDTO getCampaignProgress(Long id) {
        DonationCampaign campaign = donationCampaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation campaign not found with id: " + id));

        // Get recent donations
        List<Donation> recentDonations = donationRepository.findTop5ByCampaignOrderByUpdatedAtDesc(campaign.getCampaignId());

        // Calculate metrics (days remaining, daily average, etc.)
        long daysRemaining = calculateDaysRemaining(campaign);
        double dailyAverage = calculateDailyAverage(campaign);
        double projectedEndAmount = campaign.getCurrentAmount() + (dailyAverage * daysRemaining);

        // Build response with properly typed recent donations
        return CampaignProgressResponseDTO.builder()
                .campaignId(campaign.getCampaignId())
                .title(campaign.getTitle())
                .currentAmount(campaign.getCurrentAmount())
                .goalAmount(campaign.getGoal())
                .progressPercentage(campaign.getProgressPercentage())
                .daysRemaining(daysRemaining)
                .donorCount(campaign.getDonations() != null ? campaign.getDonations().size() : 0)
                .dailyAverageDonation(dailyAverage)
                .projectedEndAmount(projectedEndAmount)
                .onTrackToReachGoal(projectedEndAmount >= campaign.getGoal())
                .recentDonations(mapRecentDonations(recentDonations))
                .build();
    }

    // Helper method to properly type the recent donations map
    private List<Map<String, Object>> mapRecentDonations(List<Donation> donations) {
        return donations.stream()
                .map(donation -> {
                    Map<String, Object> donationMap = new HashMap<>();
                    donationMap.put("amount", donation.getAmount());
                    donationMap.put("date", donation.getUpdatedAt());
                    donationMap.put("donorName", donation.getUser() != null ?
                            donation.getUser().getName() : "Anonymous");
                    return donationMap;
                })
                .collect(Collectors.toList());
    }

    private long calculateDaysRemaining(DonationCampaign campaign) {
        if (campaign.getEndDate() == null || !campaign.getEndDate().isAfter(LocalDateTime.now())) {
            return 0;
        }
        return ChronoUnit.DAYS.between(LocalDateTime.now(), campaign.getEndDate());
    }

    private double calculateDailyAverage(DonationCampaign campaign) {
        if (campaign.getCreatedAt() == null) {
            return 0.0;
        }
        long campaignDays = Math.max(1, ChronoUnit.DAYS.between(
                campaign.getCreatedAt(), LocalDateTime.now()));
        return campaign.getCurrentAmount() / campaignDays;
    }


}
