package com.sudoers.elvitrinabackend.service.customOrder;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;

import java.util.List;
import java.util.Optional;

public interface ICustomOrderService {
    CustomOrder createOrderWithUser(CustomOrder order, Long userId);

    CustomOrder createOrder(CustomOrder order);
    Optional<CustomOrder> getOrderById(Long id);
    List<CustomOrder> getAllOrders();
    CustomOrder updateOrder(Long id, CustomOrder order);
    void deleteOrder(Long id);


        // Méthodes supplémentaires
    CustomOrder updateOrderStatus(Long orderId, Long userId, OrderStatusType newStatus);
    List<CustomOrder> getUserOrders(Long userId);
    List<CustomOrder> getUserOrdersByStatus(Long userId, OrderStatusType status);


    CustomOrder addProductToOrder(Long orderId, Long productId);

    CustomOrder removeProductFromOrder(Long orderId, Long productId);
}

