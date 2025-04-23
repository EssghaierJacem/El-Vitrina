// src/app/models/storeFeedback/store-feedback-type.type.ts
export enum StoreFeedbackType {
    PRODUCT_QUALITY = 'PRODUCT_QUALITY',
    SHIPPING = 'SHIPPING',
    CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
    PRICE = 'PRICE',
    OVERALL_EXPERIENCE = 'OVERALL_EXPERIENCE'
}

// Add a helper function to get display names
export const getStoreFeedbackTypeDisplayName = (type: StoreFeedbackType): string => {
    switch (type) {
        case StoreFeedbackType.PRODUCT_QUALITY:
            return 'Product Quality';
        case StoreFeedbackType.SHIPPING:
            return 'Shipping';
        case StoreFeedbackType.CUSTOMER_SERVICE:
            return 'Customer Service';
        case StoreFeedbackType.PRICE:
            return 'Price';
        case StoreFeedbackType.OVERALL_EXPERIENCE:
            return 'Overall Experience';
        default:
            return type;
    }
};