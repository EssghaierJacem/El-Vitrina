package com.sudoers.elvitrinabackend.service.payment;

import com.sudoers.elvitrinabackend.model.dto.PaymentDTO;
import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.model.entity.Payment;
import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;
import com.sudoers.elvitrinabackend.model.enums.PaymentMethodType;
import com.sudoers.elvitrinabackend.model.enums.PaymentStatusType;
import com.sudoers.elvitrinabackend.repository.CustomOrderRepository;
import com.sudoers.elvitrinabackend.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentService implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final CustomOrderRepository customOrderRepository;

    public PaymentService(PaymentRepository paymentRepository, CustomOrderRepository customOrderRepository) {
        this.paymentRepository = paymentRepository;
        this.customOrderRepository = customOrderRepository;
    }

    @Override
    public PaymentDTO createPayment(PaymentDTO dto) {
        Payment payment = new Payment();
        payment.setAmount(dto.getAmount());
        payment.setTransactionDate(dto.getTransactionDate());
        payment.setMethod(dto.getMethod());
        payment.setPaystatus(dto.getPaystatus());

        Payment saved = paymentRepository.save(payment);
        return convertToDTO(saved);
    }

    @Override
    public Optional<PaymentDTO> getPaymentById(Long id) {
        return paymentRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentDTO updatePayment(Long id, PaymentDTO dto) {
        return paymentRepository.findById(id)
                .map(existing -> {
                    existing.setAmount(dto.getAmount());
                    existing.setTransactionDate(dto.getTransactionDate());
                    existing.setMethod(dto.getMethod());
                    existing.setPaystatus(dto.getPaystatus());
                    return convertToDTO(paymentRepository.save(existing));
                })
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + id));
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    @Transactional
    @Override
    public PaymentDTO processPayment(Long orderId, double amount, String paymentMethod) {
        CustomOrder order = customOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

        Payment payment = new Payment();
        payment.setAmount(amount);
        payment.setTransactionDate(LocalDateTime.now());
        payment.setMethod(PaymentMethodType.valueOf(paymentMethod));
        payment.setPaystatus(PaymentStatusType.SUCCESS);
        payment.setOrders(List.of(order)); // association

        Payment saved = paymentRepository.save(payment);

        order.setStatus(OrderStatusType.PAID);
        order.setPayment(saved);
        customOrderRepository.save(order);

        return convertToDTO(saved);
    }

    @Override
    public PaymentDTO validatePayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getPaystatus() == PaymentStatusType.SUCCESS) {
            throw new RuntimeException("Payment is already validated");
        }

        payment.setPaystatus(PaymentStatusType.SUCCESS);
        return convertToDTO(paymentRepository.save(payment));
    }

    private PaymentDTO convertToDTO(Payment payment) {
        List<Long> orderIds = payment.getOrders() != null
                ? payment.getOrders().stream().map(CustomOrder::getId).collect(Collectors.toList())
                : null;

        return new PaymentDTO(
                payment.getId(),
                payment.getAmount(),
                payment.getTransactionDate(),
                payment.getMethod(),
                payment.getPaystatus(),
                orderIds
        );
    }
}
