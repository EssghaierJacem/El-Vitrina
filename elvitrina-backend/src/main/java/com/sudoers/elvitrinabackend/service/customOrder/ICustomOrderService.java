package com.sudoers.elvitrinabackend.service.customOrder;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;

import java.util.List;
import java.util.Optional;

public interface ICustomOrderService {

    List<CustomOrder> findAll();
    Optional<CustomOrder> findById(Long id);

    CustomOrder saveCustomOrder(CustomOrder customOrder);

    CustomOrder update(Long id, CustomOrder customOrder);
    void delete(Long id);









        // Méthodes supplémentaires
    // CustomOrder createOrderWithUser(CustomOrder order, Long userId);
    //CustomOrder updateOrderStatus(Long orderId, Long userId, OrderStatusType newStatus);
    //List<CustomOrder> getUserOrders(Long userId);
    ///List<CustomOrder> getUserOrdersByStatus(Long userId, OrderStatusType status);


   // CustomOrder addProductToOrder(Long orderId, Long productId);

   /// CustomOrder removeProductFromOrder(Long orderId, Long productId);
}

