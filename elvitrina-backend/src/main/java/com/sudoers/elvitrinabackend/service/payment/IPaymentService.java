package com.sudoers.elvitrinabackend.service.payment;


import com.sudoers.elvitrinabackend.model.dto.PaymentDTO;

import java.util.List;
import java.util.Optional;

public interface IPaymentService {
    PaymentDTO createPayment(PaymentDTO paymentDTO);
    Optional<PaymentDTO> getPaymentById(Long id);
    List<PaymentDTO> getAllPayments();
    PaymentDTO updatePayment(Long id, PaymentDTO paymentDTO);
    void deletePayment(Long id);
    PaymentDTO processPayment(Long orderId, double amount, String paymentMethod);
    PaymentDTO validatePayment(Long paymentId);
}
