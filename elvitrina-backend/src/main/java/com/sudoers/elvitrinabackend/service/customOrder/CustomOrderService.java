package com.sudoers.elvitrinabackend.service.customOrder;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.repository.CustomOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class CustomOrderService implements ICustomOrderService{


    private final CustomOrderRepository customOrderRepository;

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
}
