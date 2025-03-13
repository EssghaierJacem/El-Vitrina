package com.sudoers.elvitrinabackend.service.Advertisement;

import com.sudoers.elvitrinabackend.model.entity.Advertisement;
import com.sudoers.elvitrinabackend.repository.AdvertisementRepository;
import com.sudoers.elvitrinabackend.service.Advertisement.AdvertisementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdvertisementServiceImpl implements AdvertisementService {

    @Autowired
    private AdvertisementRepository advertisementRepository;

    @Override
    public Advertisement saveAdvertisement(Advertisement advertisement) {
        return advertisementRepository.save(advertisement);
    }

    @Override
    public List<Advertisement> getAllAdvertisements() {
        return advertisementRepository.findAll();
    }

    @Override
    public Advertisement getAdvertisementById(Long id) {
        Optional<Advertisement> advertisement = advertisementRepository.findById(id);
        return advertisement.orElseThrow(() -> new RuntimeException("Advertisement not found"));
    }

    @Override
    public void deleteAdvertisement(Long id) {
        advertisementRepository.deleteById(id);
    }

    @Override
    public Advertisement updateAdvertisement(Long id, Advertisement advertisement) {
        Advertisement existingAdvertisement = getAdvertisementById(id);
        existingAdvertisement.setTitle(advertisement.getTitle());
        existingAdvertisement.setContent(advertisement.getContent());
        existingAdvertisement.setStartDate(advertisement.getStartDate());
        existingAdvertisement.setEndDate(advertisement.getEndDate());
        existingAdvertisement.setBudget(advertisement.getBudget());
        existingAdvertisement.setImpressions(advertisement.getImpressions());
        existingAdvertisement.setClicks(advertisement.getClicks());
        existingAdvertisement.setStatus(advertisement.getStatus());
        existingAdvertisement.setVideoUrl(advertisement.getVideoUrl());
        existingAdvertisement.setImages(advertisement.getImages());
        return advertisementRepository.save(existingAdvertisement);
    }
}