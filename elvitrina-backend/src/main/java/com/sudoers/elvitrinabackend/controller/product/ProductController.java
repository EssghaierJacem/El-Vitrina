package com.sudoers.elvitrinabackend.controller.product;

import com.sudoers.elvitrinabackend.model.dto.ProductCreationDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductSummaryDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductUpdateDTO;
import com.sudoers.elvitrinabackend.model.dto.ImageAnalysisDTO;
import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import com.sudoers.elvitrinabackend.model.enums.ProductStatus;
import com.sudoers.elvitrinabackend.service.product.ProductService;
import com.sudoers.elvitrinabackend.service.Image.ImageUploadService;
import jdk.jfr.ContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // ---- CRUD Endpoints ----
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ProductDTO> createProduct(
            @RequestPart("product") ProductCreationDTO productDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        ProductDTO createdProduct = productService.createProduct(productDTO, images);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/summaries")
    public ResponseEntity<List<ProductSummaryDTO>> getAllProductSummaries() {
        List<ProductSummaryDTO> summaries = productService.getAllProductSummaries();
        return ResponseEntity.ok(summaries);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") ProductUpdateDTO productDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        ProductDTO updatedProduct = productService.updateProduct(id, productDTO, images);
        return ResponseEntity.ok(updatedProduct);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/batch")
    public ResponseEntity<Void> deleteMultipleProducts(@RequestBody List<Long> productIds) {
        productService.deleteMultipleProducts(productIds);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllProducts() {
        productService.deleteAllProducts();
        return ResponseEntity.noContent().build();
    }

    // ---- Search & Filtering Endpoints ----
    @GetMapping("/search")
    public ResponseEntity<List<ProductSummaryDTO>> searchProductsByName(@RequestParam String name) {
        List<ProductSummaryDTO> results = productService.searchProductsByName(name);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductSummaryDTO>> findProductsByCategory(
            @PathVariable ProductCategoryType category) {
        List<ProductSummaryDTO> products = productService.findProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<ProductSummaryDTO>> findProductsByPriceRange(
            @RequestParam double minPrice,
            @RequestParam double maxPrice) {
        List<ProductSummaryDTO> products = productService.findProductsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/discounted")
    public ResponseEntity<List<ProductSummaryDTO>> findProductsWithDiscount() {
        List<ProductSummaryDTO> products = productService.findProductsWithDiscount();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ProductSummaryDTO>> findProductsByStore(@PathVariable Long storeId) {
        List<ProductSummaryDTO> products = productService.findProductsByStore(storeId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<ProductSummaryDTO>> findAllPaginated(Pageable pageable) {
        Page<ProductSummaryDTO> page = productService.findAllPaginated(pageable);
        return ResponseEntity.ok(page);
    }

    // ---- Sorting Endpoint ----
    @GetMapping("/sorted")
    public ResponseEntity<List<ProductSummaryDTO>> findAllSorted(
            @RequestParam String sortBy,
            @RequestParam String direction) {
        List<ProductSummaryDTO> products = productService.findAllSorted(sortBy, direction);
        return ResponseEntity.ok(products);
    }

    // ---- Statistics Endpoints ----
    @GetMapping("/stats/category-count")
    public ResponseEntity<List<Map<String, Object>>> countProductsByCategory() {
        Map<ProductCategoryType, Long> rawStats = productService.countProductsByCategory();
        List<Map<String, Object>> formattedStats = new ArrayList<>();
        
        rawStats.forEach((category, count) -> {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("category", category);
            categoryData.put("count", count);
            formattedStats.add(categoryData);
        });
        
        return ResponseEntity.ok(formattedStats);
    }

    @GetMapping("/stats/active-count")
    public ResponseEntity<Map<String, Object>> countActiveProducts() {
        Long count = productService.countActiveProducts();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ACTIVE");
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/discounted-count")
    public ResponseEntity<Long> countProductsWithDiscount() {
        Long count = productService.countProductsWithDiscount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/avg-price")
    public ResponseEntity<Double> getAverageProductPrice() {
        Double avgPrice = productService.getAverageProductPrice();
        return ResponseEntity.ok(avgPrice);
    }

    // ---- Inventory Management Endpoints ----
    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductDTO> updateStockQuantity(
            @PathVariable Long id,
            @RequestParam int quantity) {
        ProductDTO product = productService.updateStockQuantity(id, quantity);
        return ResponseEntity.ok(product);
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ProductDTO> toggleProductStatus(@PathVariable Long id) {
        ProductDTO product = productService.toggleProductStatus(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductSummaryDTO>> findLowStockProducts(
            @RequestParam(defaultValue = "5") int threshold) {
        List<ProductSummaryDTO> products = productService.findLowStockProducts(threshold);
        return ResponseEntity.ok(products);
    }

    // ---- Bulk Operations Endpoints ----
    @PatchMapping("/bulk/prices")
    public ResponseEntity<List<ProductDTO>> bulkUpdatePrices(@RequestBody Map<Long, Double> productPriceMap) {
        List<ProductDTO> products = productService.bulkUpdatePrices(productPriceMap);
        return ResponseEntity.ok(products);
    }

    @PatchMapping("/bulk/status")
    public ResponseEntity<List<ProductDTO>> bulkUpdateStatus(
            @RequestBody List<Long> productIds,
            @RequestParam ProductStatus status) {
        List<ProductDTO> products = productService.bulkUpdateStatus(productIds, status);
        return ResponseEntity.ok(products);
    }

    // ---- Image Handling Endpoints ----
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<ProductDTO> uploadProductImage(@PathVariable Long id,
                                                         @RequestParam("image") MultipartFile imageFile) {
        ProductDTO updatedProduct = productService.addImageToProduct(id, imageFile);
        return ResponseEntity.ok(updatedProduct);
    }

    @GetMapping("/products/images/{filename:.+}")
    public ResponseEntity<Resource> getProductImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/product-images").resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}/images")
    public ResponseEntity<ProductDTO> removeImageFromProduct(
            @PathVariable Long id,
            @RequestParam String imageUrl) {
        ProductDTO product = productService.removeImageFromProduct(id, imageUrl);
        return ResponseEntity.ok(product);
    }

    // ---- Advanced Status Management ----
    @PatchMapping("/{id}/status")
    public ResponseEntity<ProductDTO> setProductStatus(
            @PathVariable Long id,
            @RequestParam ProductStatus status) {
        ProductDTO product = productService.setProductStatus(id, status);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProductDTO>> findByStatus(@PathVariable ProductStatus status) {
        List<ProductDTO> products = productService.findByStatus(status);
        return ResponseEntity.ok(products);
    }

    // Add these endpoints to your existing ProductController class

    // ---- Tag Management Endpoints ----
    @PostMapping("/{id}/tags")
    public ResponseEntity<ProductDTO> addTagsToProduct(
            @PathVariable Long id,
            @RequestBody Set<String> tags) {
        ProductDTO updatedProduct = productService.addTags(id, tags);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}/tags")
    public ResponseEntity<ProductDTO> removeTagsFromProduct(
            @PathVariable Long id,
            @RequestBody Set<String> tags) {
        ProductDTO updatedProduct = productService.removeTags(id, tags);
        return ResponseEntity.ok(updatedProduct);
    }

    // ---- Tag Search Endpoints ----
    @GetMapping("/search/by-tag")
    public ResponseEntity<List<ProductDTO>> searchProductsByTag(
            @RequestParam String tag) {
        List<ProductDTO> products = productService.findByTag(tag);
        return ResponseEntity.ok(products);
    }

    // ---- Image Analysis Endpoints ----
    
    @PostMapping("/{id}/analyze-image")
    public ResponseEntity<ImageAnalysisDTO> analyzeProductImage(
            @PathVariable Long id,
            @RequestParam String imageUrl) {
        ImageAnalysisDTO analysisResult = productService.analyzeProductImage(id, imageUrl);
        return ResponseEntity.ok(analysisResult);
    }
    
    @PostMapping("/analyze-image-file")
    public ResponseEntity<ImageAnalysisDTO> analyzeImageFile(
            @RequestParam("image") MultipartFile imageFile) {
        ImageAnalysisDTO analysisResult = productService.analyzeImageFile(imageFile);
        return ResponseEntity.ok(analysisResult);
    }
    
    @PostMapping("/{id}/apply-analysis")
    public ResponseEntity<ProductDTO> applyImageAnalysis(
            @PathVariable Long id,
            @RequestParam String imageUrl,
            @RequestParam(defaultValue = "true") boolean applyTags,
            @RequestParam(defaultValue = "true") boolean applyCategory,
            @RequestParam(defaultValue = "true") boolean applyDescription) {
        ProductDTO updatedProduct = productService.applyImageAnalysis(id, imageUrl, applyTags, applyCategory, applyDescription);
        return ResponseEntity.ok(updatedProduct);
    }

    private String saveImage(MultipartFile file) {
        try {
            // Define the upload directory (you can change this path)
            String uploadDir = "/uploads/product-images"; // Update this path as needed
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);

            // Create the directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file to the server
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Return the relative URL for the image
            return "/uploads/product-images/" + fileName; // Adjust this based on your server configuration
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }

}