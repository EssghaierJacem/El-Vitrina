package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import com.sudoers.elvitrinabackend.model.enums.ProductStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Getter
@Setter
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
    private double discountPercentage;
    private ProductStatus status;
    private List<String> images;
    private Set<String> tags;
    private Long storeId;
    private String storeName;
    private List<Long> customOrderIds;
    // Additional calculated fields
    private boolean inStock;
    private boolean isNew;
}
