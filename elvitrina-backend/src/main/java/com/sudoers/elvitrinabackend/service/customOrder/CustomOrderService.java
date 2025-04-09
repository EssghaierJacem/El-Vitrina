package com.sudoers.elvitrinabackend.service.customOrder;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.model.entity.Payment;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.CustomOrderRepository;
import com.sudoers.elvitrinabackend.repository.PaymentRepository;
import com.sudoers.elvitrinabackend.repository.ProductRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomOrderService implements ICustomOrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomOrderRepository customOrderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public CustomOrderService(UserRepository userRepository, ProductRepository productRepository,
                              CustomOrderRepository customOrderRepository, PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.customOrderRepository = customOrderRepository;
        this.paymentRepository = paymentRepository;
    }

    //--------------------SIMPLE CRUD---------------------//

    @Override
    public Optional<CustomOrder> findById(Long id) {
        return customOrderRepository.findById(id);
    }

    @Override
    public CustomOrder saveCustomOrder(CustomOrder customOrder) {
        Long userId = customOrder.getUser().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        customOrder.setUser(user); // Attacher l'utilisateur

        // Vérifier si un paiement est fourni
        if (customOrder.getPayment() != null) {
            Payment payment = customOrder.getPayment();
            paymentRepository.save(payment); // Si un paiement est présent, on le sauvegarde
        }

        return customOrderRepository.save(customOrder); // Sauvegarde de la commande
    }

    @Override
    public CustomOrder update(Long id, CustomOrder updatedOrder) {
        CustomOrder existingOrder = customOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable avec ID: " + id));

        // Mise à jour des champs simples uniquement
        existingOrder.setQuantity(updatedOrder.getQuantity());
        existingOrder.setPrice(updatedOrder.getPrice());
        existingOrder.setOrderDate(updatedOrder.getOrderDate());
        existingOrder.setCalculateTotal(updatedOrder.getCalculateTotal());
        existingOrder.setStatus(updatedOrder.getStatus());

        // Vérifier si un paiement est fourni pour la mise à jour
        if (updatedOrder.getPayment() != null) {
            existingOrder.setPayment(updatedOrder.getPayment());
        }

        return customOrderRepository.save(existingOrder);
    }

    @Override
    public void delete(Long orderId) {
        CustomOrder order = customOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        // Dissocier le paiement avant la suppression si nécessaire
        if (order.getPayment() != null) {
            Payment payment = order.getPayment();
            payment.getOrders().remove(order);  // Retirer la commande du paiement
            order.setPayment(null); // Définir le paiement à null
            paymentRepository.save(payment); // Mettre à jour le paiement
        }

        customOrderRepository.delete(order); // Suppression de la commande
    }

    @Override
    public List<CustomOrder> findAll() {
        return customOrderRepository.findAll();
    }
}
