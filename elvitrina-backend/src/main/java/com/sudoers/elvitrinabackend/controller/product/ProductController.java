package com.sudoers.elvitrinabackend.controller.product;

import com.sudoers.elvitrinabackend.model.dto.ProductCreationDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductSummaryDTO;
import com.sudoers.elvitrinabackend.model.dto.ProductUpdateDTO;
import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import com.sudoers.elvitrinabackend.model.enums.ProductStatus;
import com.sudoers.elvitrinabackend.service.product.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // ---- CRUD Endpoints ----
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductCreationDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
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
            @RequestBody ProductUpdateDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
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
    public ResponseEntity<Map<ProductCategoryType, Long>> countProductsByCategory() {
        Map<ProductCategoryType, Long> stats = productService.countProductsByCategory();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/active-count")
    public ResponseEntity<Long> countActiveProducts() {
        Long count = productService.countActiveProducts();
        return ResponseEntity.ok(count);
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
    @PostMapping("/{id}/images")
    public ResponseEntity<ProductDTO> addImageToProduct(
            @PathVariable Long id,
            @RequestParam String imageUrl) {
        ProductDTO product = productService.addImageToProduct(id, imageUrl);
        return ResponseEntity.ok(product);
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
}