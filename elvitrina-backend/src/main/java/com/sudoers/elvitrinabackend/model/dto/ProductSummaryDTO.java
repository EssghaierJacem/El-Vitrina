package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryDTO {
    private Long productId;
    private String productName;
    private double price;
    private ProductCategoryType category;
    private String mainImage;
    private boolean hasDiscount;
    private boolean inStock;
}