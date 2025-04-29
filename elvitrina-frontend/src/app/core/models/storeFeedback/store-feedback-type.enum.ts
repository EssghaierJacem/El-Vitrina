// src/app/models/storeFeedback/store-feedback-type.type.ts
export enum StoreFeedbackType {
    DELIVERY = 'DELIVERY',
    PRODUCT_QUALITY = 'PRODUCT_QUALITY',
    CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
    PRICING = 'PRICING',
    PACKAGING = 'PACKAGING'
}

// Add a helper function to get display names
export const getStoreFeedbackTypeDisplayName = (type: StoreFeedbackType): string => {
    switch (type) {
        case StoreFeedbackType.DELIVERY:
            return 'Shipping & Delivery';
        case StoreFeedbackType.PRODUCT_QUALITY:
            return 'Product Quality';
        case StoreFeedbackType.CUSTOMER_SERVICE:
            return 'Customer Service';
        case StoreFeedbackType.PRICING:
            return 'Pricing & Value';
        case StoreFeedbackType.PACKAGING:
            return 'Packaging & Presentation';
        default:
            return type;
    }
};