package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomOrderDTO {
    private Long id;
    private List<Long> productIds;
    private int quantity;
    private double price;
    private LocalDateTime orderDate;
    private double calculateTotal;
    private OrderStatusType status;
    private Long userId;
    private Long paymentId;
}
