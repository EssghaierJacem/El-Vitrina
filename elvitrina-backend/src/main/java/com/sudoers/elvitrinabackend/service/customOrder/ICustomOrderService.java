package com.sudoers.elvitrinabackend.service.customOrder;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;

import java.util.List;
import java.util.Optional;

public interface ICustomOrderService {
    CustomOrder createOrder(CustomOrder customOrder);
    Optional<CustomOrder> getOrderById(Long id);
    List<CustomOrder> getAllOrders();
    CustomOrder updateOrder(Long id, CustomOrder customOrder);
    void deleteOrder(Long id);



}
