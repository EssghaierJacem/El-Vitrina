package com.sudoers.elvitrinabackend.service.payment;

import com.sudoers.elvitrinabackend.model.entity.Payment;

import java.util.List;
import java.util.Optional;

public interface IPaymentService {
    Payment createPayment(Payment payment);
    Optional<Payment> getPaymentById(Long id);
    List<Payment> getAllPayments();
    Payment updatePayment(Long id, Payment payment);
    void deletePayment(Long id);
    public Payment processPayment(Long orderId, double amount, String paymentMethod) ;
    Payment validatePayment(Long paymentId);


}
