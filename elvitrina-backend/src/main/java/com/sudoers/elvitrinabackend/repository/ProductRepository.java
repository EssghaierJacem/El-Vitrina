package com.sudoers.elvitrinabackend.repository;
import com.sudoers.elvitrinabackend.model.entity.Product;
import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import com.sudoers.elvitrinabackend.model.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Basic queries
    List<Product> findByProductNameContainingIgnoreCase(String name);
    List<Product> findByCategory(ProductCategoryType category);
    List<Product> findByPriceBetween(double minPrice, double maxPrice);
    List<Product> findByHasDiscountTrue();
    List<Product> findByStore_StoreId(Long storeId);
    List<Product> findByStockQuantityLessThan(int threshold);

    // Statistics queries
    @Query("SELECT p.category, COUNT(p) FROM Product p GROUP BY p.category")
    Map<ProductCategoryType, Long> countByCategoryGroup();

    Long countByStatus(ProductStatus status);
    Long countByHasDiscountTrue();

    @Query("SELECT AVG(p.price) FROM Product p")
    Double findAveragePrice();

    // For status management
    List<Product> findByStatus(ProductStatus status);

    // And add this for active products count:
    default Long countActiveProducts() {
        return countByStatus(ProductStatus.ACTIVE);
    }
}
