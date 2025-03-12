package com.sudoers.elvitrinabackend.service.payment;

import com.sudoers.elvitrinabackend.model.entity.Payment;
import com.sudoers.elvitrinabackend.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService implements IPaymentService {
    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    @Override
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment updatePayment(Long id, Payment payment) {
        return paymentRepository.findById(id)
                .map(existingPayment -> {
                    existingPayment.setAmount(payment.getAmount());
                    existingPayment.setTransactionDate(payment.getTransactionDate());
                    existingPayment.setStatus(payment.getStatus());
                    existingPayment.setCustomOrder(payment.getCustomOrder());
                    return paymentRepository.save(existingPayment);
                })
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + id));
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);


    }
}
