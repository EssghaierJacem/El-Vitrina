package com.sudoers.elvitrinabackend.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinTable(
            name = "Order_product",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> products;

    private int quantity;
    private double price;
    private LocalDateTime orderDate;
    private double calculateTotal;

    @Enumerated(EnumType.STRING)
    private OrderStatusType status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, optional = true)
    @JoinColumn(name = "payment_id", nullable = true)
    private Payment payment;

}
