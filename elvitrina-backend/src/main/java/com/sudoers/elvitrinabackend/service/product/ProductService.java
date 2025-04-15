package com.sudoers.elvitrinabackend.service.product;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.ProductCreationDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductSummaryDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductUpdateDTO;
import com.sudoers.elvitrinabackend.model.entity.Product;
import com.sudoers.elvitrinabackend.model.entity.Store;
import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import com.sudoers.elvitrinabackend.model.enums.ProductStatus;
import com.sudoers.elvitrinabackend.repository.ProductRepository;
import com.sudoers.elvitrinabackend.repository.StoreRepository;
import com.sudoers.elvitrinabackend.service.Image.ImageUploadService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService implements IProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private ImageUploadService imageUploadService;
    // ---- CRUD Operations ----
    @Override
    @Transactional
    public ProductDTO createProduct(ProductCreationDTO productDTO) {
        Product product = new Product();
        copyCreationDtoToEntity(productDTO, product);

        if (productDTO.getStoreId() != null) {
            Store store = storeRepository.findById(productDTO.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
            product.setStore(store);
        }

        product.setStatus(ProductStatus.ACTIVE);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);
        return copyEntityToDto(savedProduct);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return copyEntityToDto(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::copyEntityToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> getAllProductSummaries() {
        return productRepository.findAll().stream()
                .map(this::copyEntityToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long id, ProductUpdateDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        copyUpdateDtoToEntity(productDTO, product);
        product.setUpdatedAt(LocalDateTime.now());

        Product updatedProduct = productRepository.save(product);
        return copyEntityToDto(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.delete(product);
    }

    @Override
    @Transactional
    public void deleteMultipleProducts(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            throw new IllegalArgumentException("Product IDs list cannot be null or empty");
        }

        List<Product> productsToDelete = productRepository.findAllById(productIds);
        if (productsToDelete.size() != productIds.size()) {
            throw new ResourceNotFoundException("Some products not found in the provided IDs");
        }

        productRepository.deleteAllInBatch(productsToDelete);
    }

    @Override
    @Transactional
    public void deleteAllProducts() {
        if (productRepository.count() == 0) {
            throw new IllegalStateException("No products exist to delete");
        }
        productRepository.deleteAllInBatch();
    }

    // ---- Search & Filtering ----
    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> searchProductsByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return productRepository.findByProductNameContainingIgnoreCase(name).stream()
                .map(this::copyEntityToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> findProductsByCategory(ProductCategoryType category) {
        return productRepository.findByCategory(category).stream()
                .map(this::copyEntityToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> findProductsByPriceRange(double minPrice, double maxPrice) {
        if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
            throw new IllegalArgumentException("Invalid price range");
        }
        return productRepository.findByPriceBetween(minPrice, maxPrice).stream()
                .map(this::copyEntityToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> findProductsWithDiscount() {
        return productRepository.findByHasDiscountTrue().stream()
                .map(this::copyEntityToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> findProductsByStore(Long storeId) {
        return productRepository.findByStore_StoreId(storeId).stream()
                .map(this::copyEntityToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductSummaryDTO> findAllPaginated(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::copyEntityToSummaryDto);
    }

    // ---- Sorting ----
    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> findAllSorted(String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();
        return productRepository.findAll(sort).stream()
                .map(this::copyEntityToSummaryDto)
                .collect(Collectors.toList());
    }

    // ---- Statistics ----
    @Override
    @Transactional(readOnly = true)
    public Map<ProductCategoryType, Long> countProductsByCategory() {
        return productRepository.countByCategoryGroup();
    }

    @Override
    @Transactional(readOnly = true)
    public Long countActiveProducts() {
        return productRepository.countByStatus(ProductStatus.ACTIVE);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countProductsWithDiscount() {
        return productRepository.countByHasDiscountTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageProductPrice() {
        return productRepository.findAveragePrice();
    }

    // ---- Inventory Management ----
    @Override
    @Transactional
    public ProductDTO updateStockQuantity(Long productId, int quantityChange) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        int newQuantity = product.getStockQuantity() + quantityChange;
        if (newQuantity < 0) {
            throw new IllegalStateException("Insufficient stock quantity");
        }
        product.setStockQuantity(newQuantity);

        if (newQuantity == 0) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
        } else if (product.getStatus() == ProductStatus.OUT_OF_STOCK) {
            product.setStatus(ProductStatus.ACTIVE);
        }

        Product updatedProduct = productRepository.save(product);
        return copyEntityToDto(updatedProduct);
    }

    @Override
    @Transactional
    public ProductDTO toggleProductStatus(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        ProductStatus newStatus = product.getStatus() == ProductStatus.ACTIVE
                ? ProductStatus.INACTIVE
                : ProductStatus.ACTIVE;
        product.setStatus(newStatus);

        Product updatedProduct = productRepository.save(product);
        return copyEntityToDto(updatedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductSummaryDTO> findLowStockProducts(int threshold) {
        return productRepository.findByStockQuantityLessThan(threshold).stream()
                .map(this::copyEntityToSummaryDto)
                .collect(Collectors.toList());
    }

    // ---- Bulk Operations ----
    @Override
    @Transactional
    public List<ProductDTO> bulkUpdatePrices(Map<Long, Double> productPriceMap) {
        List<Product> products = productRepository.findAllById(productPriceMap.keySet());
        products.forEach(product -> {
            Double newPrice = productPriceMap.get(product.getProductId());
            if (newPrice != null && newPrice >= 0) {
                product.setPrice(newPrice);
            }
        });

        return productRepository.saveAll(products).stream()
                .map(this::copyEntityToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ProductDTO> bulkUpdateStatus(List<Long> productIds, ProductStatus status) {
        List<Product> products = productRepository.findAllById(productIds);
        products.forEach(product -> product.setStatus(status));

        return productRepository.saveAll(products).stream()
                .map(this::copyEntityToDto)
                .collect(Collectors.toList());
    }

    // ---- Image Handling ----
    @Override
    @Transactional
    public ProductDTO addImageToProduct(Long productId, MultipartFile imageFile) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        String imageUrl = imageUploadService.uploadImage(imageFile);
        List<String> images = product.getImages();
        if (images == null) {
            images = new ArrayList<>();
        }
        images.add(imageUrl);
        product.setImages(images);
        Product updatedProduct = productRepository.save(product);
        return copyEntityToDto(updatedProduct);
    }

    @Override
    @Transactional
    public ProductDTO removeImageFromProduct(Long productId, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        List<String> images = product.getImages();
        if (images != null && images.remove(imageUrl)) {
            product.setImages(images);
            Product updatedProduct = productRepository.save(product);
            return copyEntityToDto(updatedProduct);
        }
        return copyEntityToDto(product);
    }

    // ---- Advanced Status Management ----
    @Override
    @Transactional
    public ProductDTO setProductStatus(Long productId, ProductStatus status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setStatus(status);
        Product updatedProduct = productRepository.save(product);
        return copyEntityToDto(updatedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> findByStatus(ProductStatus status) {
        return productRepository.findByStatus(status).stream()
                .map(this::copyEntityToDto)
                .collect(Collectors.toList());
    }

    // ---- Conversion Methods ----
    private ProductDTO copyEntityToDto(Product product) {
        return ProductDTO.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .category(product.getCategory())
                .categoryDisplayName(product.getCategory() != null ?
                        product.getCategory().getDisplayName() : null)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .hasDiscount(product.isHasDiscount())
                .status(product.getStatus())
                .images(product.getImages())
                .storeId(product.getStore() != null ? product.getStore().getStoreId() : null)
                .storeName(product.getStore() != null ? product.getStore().getStoreName() : null)
                .inStock(product.getStockQuantity() > 0)
                .isNew(product.getCreatedAt() != null &&
                        product.getCreatedAt().isAfter(LocalDateTime.now().minusDays(7)))
                .build();
    }

    private ProductSummaryDTO copyEntityToSummaryDto(Product product) {
        return ProductSummaryDTO.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .price(product.getPrice())
                .category(product.getCategory())
                .mainImage(product.getImages() != null && !product.getImages().isEmpty() ?
                        product.getImages().get(0) : null)
                .hasDiscount(product.isHasDiscount())
                .inStock(product.getStockQuantity() > 0)
                .build();
    }

    private void copyCreationDtoToEntity(ProductCreationDTO dto, Product entity) {
        entity.setProductName(dto.getProductName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setStockQuantity(dto.getStockQuantity());
        entity.setCategory(dto.getCategory());
        entity.setHasDiscount(dto.isHasDiscount());
        entity.setImages(dto.getImages());
    }

    private void copyUpdateDtoToEntity(ProductUpdateDTO dto, Product entity) {
        entity.setProductName(dto.getProductName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setStockQuantity(dto.getStockQuantity());
        entity.setCategory(dto.getCategory());
        entity.setHasDiscount(dto.isHasDiscount());
        entity.setImages(dto.getImages());
    }
}
