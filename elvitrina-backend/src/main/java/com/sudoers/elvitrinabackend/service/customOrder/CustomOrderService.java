package com.sudoers.elvitrinabackend.service.customOrder;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.model.entity.Product;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;
import com.sudoers.elvitrinabackend.repository.CustomOrderRepository;
import com.sudoers.elvitrinabackend.repository.PaymentRepository;
import com.sudoers.elvitrinabackend.repository.ProductRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomOrderService implements ICustomOrderService {


    @Autowired
    private UserRepository userRepository;
    private final ProductRepository ProductRepository;
    private final CustomOrderRepository customOrderRepository;
    private final PaymentRepository PaymentRepository;

    public CustomOrderService(com.sudoers.elvitrinabackend.repository.ProductRepository productRepository, CustomOrderRepository customOrderRepository, PaymentRepository PaymentRepository) {
        this.ProductRepository = productRepository;
        this.customOrderRepository = customOrderRepository;
        this.PaymentRepository = PaymentRepository;
    }
    @Override
    public CustomOrder createOrderWithUser(CustomOrder order, Long userId) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        order.setUser(existingUser);
        order.setPayment(null);
        return customOrderRepository.save(order);
    }
    @Override
    public CustomOrder createOrder(CustomOrder order) {
        order.setPayment(null);
        return customOrderRepository.save(order);
    }

    @Override
    public Optional<CustomOrder> getOrderById(Long id) {
        return customOrderRepository.findById(id);
    }

    @Override
    public List<CustomOrder> getAllOrders() {
        return customOrderRepository.findAll();
    }

    @Override
    public CustomOrder updateOrder(Long id, CustomOrder order) {
        return customOrderRepository.findById(id).map(existingOrder -> {
            existingOrder.setProducts(order.getProducts());
            existingOrder.setQuantity(order.getQuantity());
            existingOrder.setPrice(order.getPrice());
            existingOrder.setOrderDate(order.getOrderDate());
            existingOrder.setStatus(order.getStatus());
            existingOrder.setUser(order.getUser());
            return customOrderRepository.save(existingOrder);
        }).orElse(null);
    }

    @Override
    public void deleteOrder(Long id) {
        customOrderRepository.deleteById(id);
    }

    @Override
    public CustomOrder updateOrderStatus(Long orderId, Long userId, OrderStatusType newStatus) {
        return customOrderRepository.findById(orderId).map(order -> {
            if (order.getUser() != null && order.getUser().getId().equals(userId)) {
                order.setStatus(newStatus);
                return customOrderRepository.save(order);
            } else {
                throw new RuntimeException("Unauthorized or user mismatch");
            }
        }).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public List<CustomOrder> getUserOrders(Long userId) {
        return customOrderRepository.findByUserId(userId);
    }

    @Override
    public List<CustomOrder> getUserOrdersByStatus(Long userId, OrderStatusType status) {
        return customOrderRepository.findByUserIdAndStatus(userId, status);
    }

@Override
    public CustomOrder addProductToOrder(Long orderId, Long productId) {
        CustomOrder order = customOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        Product product = ProductRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        order.getProducts().add(product);
        return customOrderRepository.save(order);
    }
@Override
    public CustomOrder removeProductFromOrder(Long orderId, Long productId) {
        CustomOrder order = customOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        Product product = ProductRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        order.getProducts().remove(product);
        return customOrderRepository.save(order);
    }
}