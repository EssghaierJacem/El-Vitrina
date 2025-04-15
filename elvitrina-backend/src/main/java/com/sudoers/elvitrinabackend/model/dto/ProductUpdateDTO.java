package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateDTO {
    private String productName;
    private String description;
    private double price;
    private int stockQuantity;
    private ProductCategoryType category;
    private boolean hasDiscount;
    private List<String> images;
}