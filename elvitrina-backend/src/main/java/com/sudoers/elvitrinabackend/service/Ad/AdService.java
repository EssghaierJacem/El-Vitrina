package com.sudoers.elvitrinabackend.service.Ad;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.AdReviewRequest;
import com.sudoers.elvitrinabackend.model.entity.Ad;
import com.sudoers.elvitrinabackend.model.enums.AdStatus;
import com.sudoers.elvitrinabackend.repository.AdRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
@Service
public class AdService {

    private final AdRepository adRepository;

    public AdService(AdRepository adRepository) {
        this.adRepository = adRepository;
    }
    public Ad getAdById(Long id) {
        return adRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ad not found with id: " + id));
    }


    @Transactional
    public Ad createAd(Ad ad) {
        ad.setCreatedAt(LocalDateTime.now());
        ad.setStatus(AdStatus.PENDING);
        return adRepository.save(ad);
    }

    @Transactional
    public Ad updateAdStatus(Long id, AdStatus status, String rejectionReason) {
        Ad ad = adRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ad not found"));

        ad.setStatus(status);

        if (status == AdStatus.APPROVED) {
            ad.setIsApproved(true);
            ad.setRejectionReason(null);
        } else if (status == AdStatus.REJECTED) {
            ad.setIsApproved(false);
            ad.setRejectionReason(rejectionReason);
        }

        return adRepository.save(ad);
    }

    public List<Ad> getActiveAds() {
        return adRepository.findActiveAds(LocalDateTime.now());
    }

    public List<Ad> getPendingAds() {
        return adRepository.findByStatus(AdStatus.PENDING);
    }

    public List<Ad> filterAds(AdStatus status, String advertiserEmail) {
        return adRepository.filterAds(status, advertiserEmail);
    }

    @Transactional
    public void recordImpression(Long id) {
        adRepository.incrementImpressions(id);
    }

    @Transactional
    public void recordClick(Long id) {
        adRepository.incrementClicks(id);
    }

    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    @Transactional
    public void expireOldAds() {
        List<Ad> expiredAds = adRepository.findByEndDateBeforeAndIsApproved(
                LocalDateTime.now(),
                true
        );
        expiredAds.forEach(ad -> {
            ad.setStatus(AdStatus.EXPIRED);
            ad.setIsApproved(false);
        });
        adRepository.saveAll(expiredAds);
    }
}