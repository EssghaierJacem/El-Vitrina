package com.sudoers.elvitrinabackend.controller.CustomOrder;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.CustomOrderDTO;
import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;
import com.sudoers.elvitrinabackend.service.customOrder.CustomOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class CustomOrderController {

    private final CustomOrderService customOrderService;

    @GetMapping
    public ResponseEntity<List<CustomOrderDTO>> getAllOrders() {
        return ResponseEntity.ok(customOrderService.findAll());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<CustomOrderDTO> getOrderById(@PathVariable Long id) {
        return customOrderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CustomOrderDTO> createOrder(@RequestBody CustomOrderDTO orderDTO) {
        return ResponseEntity.ok(customOrderService.saveCustomOrder(orderDTO));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CustomOrderDTO> updateOrder(@PathVariable Long id, @RequestBody CustomOrderDTO updatedOrderDTO) {
        return ResponseEntity.ok(customOrderService.update(id, updatedOrderDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        customOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
    // Mettre à jour le statut d'une commande
    @PutMapping("/{id}/status")
    public ResponseEntity<CustomOrderDTO> updateOrderStatus2(@PathVariable Long id, @RequestBody Map<String, String> status) {
        // Recherche de la commande par son ID
        CustomOrderDTO order = customOrderService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Mettre à jour le statut de la commande
        order.setStatus(OrderStatusType.valueOf(status.get("status")));

        // Sauvegarder la commande mise à jour
        CustomOrderDTO updatedOrder = customOrderService.saveCustomOrder(order);

        return ResponseEntity.ok(updatedOrder);
    }

}
