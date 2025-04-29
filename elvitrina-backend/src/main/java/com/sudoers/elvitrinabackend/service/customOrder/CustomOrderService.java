package com.sudoers.elvitrinabackend.service.customOrder;

import com.sudoers.elvitrinabackend.model.dto.CustomOrderDTO;
import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.model.entity.Payment;
import com.sudoers.elvitrinabackend.model.entity.Product;
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

    @Override
    public List<CustomOrderDTO> findAll() {
        return customOrderRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public Optional<CustomOrderDTO> findById(Long id) {
        return customOrderRepository.findById(id)
                .map(this::toDTO);
    }

    @Override
    public CustomOrderDTO saveCustomOrder(CustomOrderDTO dto) {
        CustomOrder order = toEntity(dto);
        CustomOrder saved = customOrderRepository.save(order);
        return toDTO(saved);
    }

    @Override
    public CustomOrderDTO update(Long id, CustomOrderDTO dto) {
        CustomOrder existing = customOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable avec ID: " + id));

        existing.setQuantity(dto.getQuantity());
        existing.setPrice(dto.getPrice());
        existing.setOrderDate(dto.getOrderDate());
        existing.setCalculateTotal(dto.getCalculateTotal());
        existing.setStatus(dto.getStatus());

        if (dto.getPaymentId() != null) {
            Payment payment = paymentRepository.findById(dto.getPaymentId())
                    .orElseThrow(() -> new RuntimeException("Paiement introuvable avec ID: " + dto.getPaymentId()));
            existing.setPayment(payment);
        }

        return toDTO(customOrderRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        CustomOrder order = customOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if (order.getPayment() != null) {
            Payment payment = order.getPayment();
            payment.getOrders().remove(order);
            order.setPayment(null);
            paymentRepository.save(payment);
        }

        customOrderRepository.delete(order);
    }

    // ------------------------------
    // Helpers pour conversion DTO <-> Entity
    // ------------------------------

    private CustomOrderDTO toDTO(CustomOrder order) {
        List<Long> productIds = order.getProducts() != null
                ? order.getProducts().stream().map(Product::getProductId).toList()
                : null;

        return new CustomOrderDTO(
                order.getId(),
                productIds,
                order.getQuantity(),
                order.getPrice(),
                order.getOrderDate(),
                order.getCalculateTotal(),
                order.getStatus(),
                order.getUser() != null ? order.getUser().getId() : null,
                order.getPayment() != null ? order.getPayment().getId() : null
        );
    }

    private CustomOrder toEntity(CustomOrderDTO dto) {
        CustomOrder order = new CustomOrder();

        if (dto.getId() != null) {
            order.setId(dto.getId());
        }

        if (dto.getProductIds() != null) {
            List<Product> products = dto.getProductIds().stream()
                    .map(id -> productRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Produit introuvable avec ID: " + id)))
                    .toList();
            order.setProducts(products);
        }

        order.setQuantity(dto.getQuantity());
        order.setPrice(dto.getPrice());
        order.setOrderDate(dto.getOrderDate());
        order.setCalculateTotal(dto.getCalculateTotal());
        order.setStatus(dto.getStatus());

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec ID: " + dto.getUserId()));
            order.setUser(user);
        }

        if (dto.getPaymentId() != null) {
            Payment payment = paymentRepository.findById(dto.getPaymentId())
                    .orElseThrow(() -> new RuntimeException("Paiement introuvable avec ID: " + dto.getPaymentId()));
            order.setPayment(payment);
        }

        return order;
    }
}
