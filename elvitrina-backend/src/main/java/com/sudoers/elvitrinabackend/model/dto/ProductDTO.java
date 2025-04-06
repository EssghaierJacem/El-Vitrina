package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import com.sudoers.elvitrinabackend.model.enums.ProductStatus;
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
public class ProductDTO {
    private Long productId;
    private String productName;
    private String description;
    private double price;
    private int stockQuantity;
    private ProductCategoryType category;
    private String categoryDisplayName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean hasDiscount;
    private ProductStatus status;
    private List<String> images;
    private Long storeId;
    private String storeName;
    private List<Long> customOrderIds;
    // Additional calculated fields
    private boolean inStock;
    private boolean isNew;
}
