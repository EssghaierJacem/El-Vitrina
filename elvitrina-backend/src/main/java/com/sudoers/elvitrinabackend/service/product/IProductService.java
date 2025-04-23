package com.sudoers.elvitrinabackend.service.product;

import com.sudoers.elvitrinabackend.model.dto.ProductCreationDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductSummaryDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductUpdateDTO;
import com.sudoers.elvitrinabackend.model.dto.ImageAnalysisDTO;
import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import com.sudoers.elvitrinabackend.model.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface IProductService {
    ProductDTO createProduct(ProductCreationDTO productDTO, List<MultipartFile> images);
    ProductDTO getProductById(Long id);
    List<ProductDTO> getAllProducts();
    List<ProductSummaryDTO> getAllProductSummaries();
    ProductDTO updateProduct(Long id, ProductUpdateDTO productDTO, List<MultipartFile> newImages);
    void deleteProduct(Long id);
    void deleteMultipleProducts(List<Long> productIds);
    void deleteAllProducts();

    // Search & Filtering
    List<ProductSummaryDTO> searchProductsByName(String name);
    List<ProductSummaryDTO> findProductsByCategory(ProductCategoryType category);
    List<ProductSummaryDTO> findProductsByPriceRange(double minPrice, double maxPrice);
    List<ProductSummaryDTO> findProductsWithDiscount();
    List<ProductSummaryDTO> findProductsByStore(Long storeId);
    Page<ProductSummaryDTO> findAllPaginated(Pageable pageable);

    // Sorting
    List<ProductSummaryDTO> findAllSorted(String sortBy, String direction);

    // Statistics
    Map<ProductCategoryType, Long> countProductsByCategory();
    Long countActiveProducts();
    Long countProductsWithDiscount();
    Double getAverageProductPrice();

    // Inventory Management
    ProductDTO updateStockQuantity(Long productId, int quantityChange);
    ProductDTO toggleProductStatus(Long productId);
    List<ProductSummaryDTO> findLowStockProducts(int threshold);

    // Bulk Operations
    List<ProductDTO> bulkUpdatePrices(Map<Long, Double> productPriceMap);
    List<ProductDTO> bulkUpdateStatus(List<Long> productIds, ProductStatus status);

    // Image Handling
    ProductDTO addImageToProduct(Long productId, MultipartFile imageFile);
    ProductDTO removeImageFromProduct(Long productId, String imageUrl);

    // Advanced Status Management
    ProductDTO setProductStatus(Long productId, ProductStatus status);
    List<ProductDTO> findByStatus(ProductStatus status);
    ProductDTO addTags(Long productId, Set<String> tags);
    ProductDTO removeTags(Long productId, Set<String> tags);
    List<ProductDTO> findByTag(String tag);
    
    // Image Analysis
    ImageAnalysisDTO analyzeProductImage(Long productId, String imageUrl);
    ImageAnalysisDTO analyzeImageFile(MultipartFile imageFile);
    ProductDTO applyImageAnalysis(Long productId, String imageUrl, boolean applyTags, boolean applyCategory, boolean applyDescription);
}
