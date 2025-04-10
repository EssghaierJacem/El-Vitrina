package com.sudoers.elvitrinabackend.service.payment;

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

@Service
public class PaymentService implements IPaymentService {
    private final PaymentRepository paymentRepository;
    private final CustomOrderRepository customOrderRepository;


    public PaymentService(PaymentRepository paymentRepository, CustomOrderRepository customOrderRepository) {
        this.paymentRepository = paymentRepository;
        this.customOrderRepository = customOrderRepository;
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
                    existingPayment.setMethod(payment.getMethod());
                    return paymentRepository.save(existingPayment);
                })
                .orElseThrow(() -> new RuntimeException("Payment not found with id " + id));
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);


    }
    @Transactional
    public Payment processPayment(Long orderId, double amount, String paymentMethod) {
        CustomOrder order = customOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

     //   if (order.getTotalAmount() != amount) {
      //      throw new RuntimeException("Montant incorrect");
     //   }

        Payment payment = new Payment();
        payment.setAmount(amount);
        payment.setTransactionDate(LocalDateTime.now());
        payment.setMethod(PaymentMethodType.valueOf(paymentMethod));
        payment.setPaystatus(PaymentStatusType.SUCCESS);
       // payment.setOrder(order);

        paymentRepository.save(payment);

        // Mettre à jour le statut de la commande
        // order.setStatus(PaymentStatusType.PAID);
        //   customOrderRepository.save(order);

        return payment;
    }

    // methode 2 : validation d'un payment
    public Payment validatePayment(Long paymentId) {
        // Récupérer le paiement
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Vérifier si le paiement est déjà validé
        if (payment.getPaystatus() == PaymentStatusType.SUCCESS) {
            throw new RuntimeException("Payment is already validated");
        }

        // Récupérer la commande associée au paiement
      //  CustomOrder order = payment.getCustomorder();

        // Vérifier si le montant du paiement est correct
        //if (payment.getAmount() != order.getPrice()) {
       //     throw new RuntimeException("Payment amount does not match order amount");
       // }

        // Valider le paiement
        payment.setPaystatus(PaymentStatusType.SUCCESS);
        paymentRepository.save(payment);

        // Mettre à jour le statut de la commande
      //  CustomOrder order;
       // order.setStatus(OrderStatusType.PAID);
       // customOrderRepository.save(order);

        return payment;
    }
}
