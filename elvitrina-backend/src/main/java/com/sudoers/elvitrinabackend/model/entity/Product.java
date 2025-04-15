package com.sudoers.elvitrinabackend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sudoers.elvitrinabackend.model.enums.ProductCategoryType;
import com.sudoers.elvitrinabackend.model.enums.ProductStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Product implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must be less than 100 characters")
    private String productName;

    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @PositiveOrZero(message = "Price must be a positive number or zero")
    private double price;

    @PositiveOrZero(message = "Stock quantity must be a positive number or zero")
    private int stockQuantity;

    @Enumerated(EnumType.STRING)
    private ProductCategoryType category;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private boolean hasDiscount;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @ElementCollection
    private List<String> images;

    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;

    @ManyToMany(mappedBy = "products", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    //@JsonIgnore
    private List<CustomOrder> customOrders;

    public boolean isActive() {
        return status == ProductStatus.ACTIVE;
    }

}
