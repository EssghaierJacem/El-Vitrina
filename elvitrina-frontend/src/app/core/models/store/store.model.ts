export interface Store {
    storeId: number;
    storeName: string;
    description?: string;
    category?: StoreCategoryType;
    createdAt?: string;
    updatedAt?: string;
    status: boolean;
    address: string;
    image?: string;
    userId?: number;
  }
  
  // Update the StoreCategoryType to match your enum
  export type StoreCategoryType = 
    | 'HANDMADE_JEWELRY'
    | 'POTTERY_CERAMICS'
    | 'TEXTILES_FABRICS'
    | 'ART_PAINTINGS'
    | 'HOME_DECOR'
    | 'CLOTHING_ACCESSORIES'
    | 'ECO_FRIENDLY'
    | 'LOCAL_FOODS'
    | 'HEALTH_WELLNESS'
    | 'BOOKS_STATIONERY'
    | 'TOYS_GAMES'
    | 'VINTAGE_ANTIQUES'
    | 'DIGITAL_PRODUCTS'
    | 'CRAFTS_DIY'
    | 'PET_SUPPLIES';
  
  // Add a utility function to get display names
  export function getCategoryDisplayName(category: StoreCategoryType): string {
    const categoryMap: Record<StoreCategoryType, string> = {
      HANDMADE_JEWELRY: 'Handmade Jewelry Store',
      POTTERY_CERAMICS: 'Pottery & Ceramics Store',
      TEXTILES_FABRICS: 'Textiles & Fabrics Store',
      ART_PAINTINGS: 'Art & Paintings Store',
      HOME_DECOR: 'Home Decor Store',
      CLOTHING_ACCESSORIES: 'Clothing & Accessories Store',
      ECO_FRIENDLY: 'Eco-Friendly Products Store',
      LOCAL_FOODS: 'Local Foods & Beverages Store',
      HEALTH_WELLNESS: 'Health & Wellness Store',
      BOOKS_STATIONERY: 'Books & Stationery Store',
      TOYS_GAMES: 'Toys & Games Store',
      VINTAGE_ANTIQUES: 'Vintage & Antiques Store',
      DIGITAL_PRODUCTS: 'Digital Products Store',
      CRAFTS_DIY: 'Crafts & DIY Kits Store',
      PET_SUPPLIES: 'Pet Supplies Store'
    };
    return categoryMap[category] || category;
  }
  
  export interface StoreCreateRequest {
    storeName: string;
    description?: string;
    category?: StoreCategoryType;
    address: string;
    image?: string;
  }
  
  export interface StoreUpdateRequest {
    storeName?: string;
    description?: string;
    category?: StoreCategoryType;
    address?: string;
    image?: string;
    status?: boolean;
  }