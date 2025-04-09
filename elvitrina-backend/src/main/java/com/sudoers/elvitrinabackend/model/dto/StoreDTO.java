package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.enums.StoreCategoryType;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreDTO {
    private Long storeId;
    private String storeName;
    private String description;
    private StoreCategoryType category;
    private String categoryDisplayName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean status;
    private String address;
    private String image;
    private boolean featured;
    private String coverImage;
    private Long userId;
    private List<Long> feedbackIds;
    private List<StoreFeedbackDTO> feedbacks;
    private List<Long> productIds;
    private List<Long> donationIds;
    private List<Long> donationCampaignIds;
    private List<Long> virtualEventIds;
    private List<Long> advertisementIds;
    // Additional fields that might be useful
    private Double averageRating;
    private Integer feedbackCount;
    private Integer productCount;
}
