package com.sudoers.elvitrinabackend.model.entity;

import com.sudoers.elvitrinabackend.model.enums.PaymentMethodType;
import com.sudoers.elvitrinabackend.model.enums.PaymentStatusType;
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
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;
    private LocalDateTime transactionDate;

    @Enumerated(EnumType.STRING)
    private PaymentMethodType method;

    @Enumerated(EnumType.STRING)
    private PaymentStatusType paystatus;

    @OneToMany(mappedBy = "payment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CustomOrder> orders;
}