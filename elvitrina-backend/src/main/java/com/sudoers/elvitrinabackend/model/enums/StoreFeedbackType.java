package com.sudoers.elvitrinabackend.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum StoreFeedbackType {
    DELIVERY("Delivery"),
    PRODUCT_QUALITY("Product Quality"),
    CUSTOMER_SERVICE("Customer Service"),
    PRICING("Pricing"),
    PACKAGING("Packaging");

    private final String displayName;
}
