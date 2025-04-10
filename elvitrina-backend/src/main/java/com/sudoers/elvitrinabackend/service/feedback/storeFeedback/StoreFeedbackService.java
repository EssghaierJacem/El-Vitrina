package com.sudoers.elvitrinabackend.service.feedback.storeFeedback;

import com.sudoers.elvitrinabackend.model.dto.StoreFeedbackDTO;
import com.sudoers.elvitrinabackend.model.entity.StoreFeedback;
import com.sudoers.elvitrinabackend.model.entity.Store;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.StoreFeedBackRepository;
import com.sudoers.elvitrinabackend.repository.StoreRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StoreFeedbackService implements IStoreFeedbackService {

    @Autowired
    private StoreFeedBackRepository storeFeedbackRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public StoreFeedbackDTO saveStoreFeedback(StoreFeedbackDTO storeFeedbackDTO) {
        Store store = storeRepository.findById(storeFeedbackDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        User user = null;
        if (storeFeedbackDTO.getUserId() != null) {
            user = userRepository.findById(storeFeedbackDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        StoreFeedback storeFeedback = new StoreFeedback();
        storeFeedback.setRating(storeFeedbackDTO.getRating());
        storeFeedback.setComment(storeFeedbackDTO.getComment());
        storeFeedback.setWouldRecommend(storeFeedbackDTO.getWouldRecommend());
        storeFeedback.setStoreFeedbackType(storeFeedbackDTO.getStoreFeedbackType());
        storeFeedback.setStore(store);
        storeFeedback.setUser(user); // null is acceptable if your entity allows it
        storeFeedback.setCreatedAt(LocalDateTime.now());

        StoreFeedback savedFeedback = storeFeedbackRepository.save(storeFeedback);
        return convertToDTO(savedFeedback);
    }


    @Override
    @Transactional(readOnly = true)
    public List<StoreFeedbackDTO> getAllStoreFeedbacks() {
        return storeFeedbackRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StoreFeedbackDTO getStoreFeedbackById(Long id) {
        return storeFeedbackRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Store feedback not found"));
    }

    @Override
    public StoreFeedbackDTO updateStoreFeedback(Long id, StoreFeedbackDTO storeFeedbackDTO) {
        StoreFeedback existingFeedback = storeFeedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store feedback not found"));

        existingFeedback.setRating(storeFeedbackDTO.getRating());
        existingFeedback.setComment(storeFeedbackDTO.getComment());
        existingFeedback.setWouldRecommend(storeFeedbackDTO.getWouldRecommend());
        existingFeedback.setStoreFeedbackType(storeFeedbackDTO.getStoreFeedbackType());

        StoreFeedback updatedFeedback = storeFeedbackRepository.save(existingFeedback);
        return convertToDTO(updatedFeedback);
    }

    @Override
    public void deleteStoreFeedback(Long id) {
        storeFeedbackRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageRatingByStoreId(Long storeId) {
        return storeFeedbackRepository.findAverageRatingByStoreId(storeId);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByStoreId(Long storeId) {
        return storeFeedbackRepository.countByStore_StoreId(storeId);
    }

    private StoreFeedbackDTO convertToDTO(StoreFeedback storeFeedback) {
        User user = storeFeedback.getUser();

        return StoreFeedbackDTO.builder()
                .storeFeedbackId(storeFeedback.getStoreFeedbackId())
                .rating(storeFeedback.getRating())
                .comment(storeFeedback.getComment())
                .createdAt(storeFeedback.getCreatedAt())
                .wouldRecommend(storeFeedback.isWouldRecommend())
                .storeFeedbackType(storeFeedback.getStoreFeedbackType())
                .storeId(storeFeedback.getStore().getStoreId())
                .userId(user != null ? user.getId() : null)
                .userName(user != null ? user.getName() : null)
                .userEmail(user != null ? user.getEmail() : null)
                .userImage(user != null ? user.getImage() : null)
                .build();
    }


    @Transactional(readOnly = true)
    public List<StoreFeedbackDTO> getFeedbacksByStoreId(Long storeId) {
        return storeFeedbackRepository.findByStoreStoreId(storeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}