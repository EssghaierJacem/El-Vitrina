package com.sudoers.elvitrinabackend.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum StoreCategoryType {
    HANDMADE_JEWELRY("Handmade Jewelry Store"),
    POTTERY_CERAMICS("Pottery & Ceramics Store"),
    TEXTILES_FABRICS("Textiles & Fabrics Store"),
    ART_PAINTINGS("Art & Paintings Store"),
    HOME_DECOR("Home Decor Store"),
    CLOTHING_ACCESSORIES("Clothing & Accessories Store"),
    ECO_FRIENDLY("Eco-Friendly Products Store"),
    LOCAL_FOODS("Local Foods & Beverages Store"),
    HEALTH_WELLNESS("Health & Wellness Store"),
    BOOKS_STATIONERY("Books & Stationery Store"),
    TOYS_GAMES("Toys & Games Store"),
    VINTAGE_ANTIQUES("Vintage & Antiques Store"),
    DIGITAL_PRODUCTS("Digital Products Store"),
    CRAFTS_DIY("Crafts & DIY Kits Store"),
    PET_SUPPLIES("Pet Supplies Store");

    private final String displayName;
}
