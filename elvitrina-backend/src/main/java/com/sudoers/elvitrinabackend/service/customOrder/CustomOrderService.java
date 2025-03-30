package com.sudoers.elvitrinabackend.service.customOrder;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;
import com.sudoers.elvitrinabackend.repository.CustomOrderRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.hibernate.query.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

import static com.sudoers.elvitrinabackend.model.enums.OrderStatusType.*;

@Service
public class CustomOrderService implements ICustomOrderService{


    private final CustomOrderRepository customOrderRepository;
    @Autowired
    private UserRepository userRepository;


    @Autowired
    public CustomOrderService(CustomOrderRepository customOrderRepository) {
        this.customOrderRepository = customOrderRepository;
    }
    @Override
    public CustomOrder createOrder(CustomOrder customOrder) {
        return customOrderRepository.save(customOrder);
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
    public CustomOrder updateOrder(Long id, CustomOrder customOrder) {
        if (!customOrderRepository.existsById(id)) {
            return null; // Or throw an exception like ResourceNotFoundException
        }
        customOrder.setId(id);
        return customOrderRepository.save(customOrder);
        }

    @Override
    public void deleteOrder(Long id) {
        customOrderRepository.deleteById(id);

    }



    @Transactional
    public CustomOrder updateOrderStatus(Long orderId, Long userId, OrderStatusType newStatus) {
        // Find the order and verify it exists
        CustomOrder order = customOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Verify the order belongs to the specified user
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Order does not belong to the specified user");
        }

        // Validate status transition
        validateStatusTransition(order.getStatus(), newStatus);

        // Update the status
        order.setStatus(newStatus);

        // Save and return the updated order
        return customOrderRepository.save(order);
    }

    private void validateStatusTransition(OrderStatusType currentStatus, OrderStatusType newStatus) {
        // Add validation rules for status transitions
        switch (currentStatus) {
            case PENDING:
                if (newStatus != OrderStatusType.PAID) {
                    throw new IllegalStateException("Order in PENDING state can only transition to PAID state");
                }
                break;
            case PAID:
                if (newStatus != OrderStatusType.DELIVERED) {
                    throw new IllegalStateException("Order in PAID state can only transition to DELIVERED state");
                }
                break;
            case DELIVERED:
                throw new IllegalStateException("Cannot change status of a DELIVERED order");
            default:
                throw new IllegalStateException("Unknown order status: " + currentStatus);
        }
    }
    // Méthode pour obtenir toutes les commandes d'un utilisateur
    public List<CustomOrder> getUserOrders(Long userId) {
        return customOrderRepository.findByUserId(userId);
    }

    // Méthode pour obtenir les commandes d'un utilisateur filtrées par statut
    public List<CustomOrder> getUserOrdersByStatus(Long userId, OrderStatusType status) {
        return customOrderRepository.findByUserIdAndStatus(userId, status);
    }
}
