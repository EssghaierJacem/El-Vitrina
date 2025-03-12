package com.sudoers.elvitrinabackend.service.Advertisement;

import com.sudoers.elvitrinabackend.model.entity.Advertisement;

import java.util.List;

public interface AdvertisementService {
    Advertisement saveAdvertisement(Advertisement advertisement);
    List<Advertisement> getAllAdvertisements();
    Advertisement getAdvertisementById(Long id);
    void deleteAdvertisement(Long id);
    Advertisement updateAdvertisement(Long id, Advertisement advertisement);
}