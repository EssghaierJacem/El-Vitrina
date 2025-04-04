package com.sudoers.elvitrinabackend.controller.CustomOrder;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;
import com.sudoers.elvitrinabackend.service.customOrder.CustomOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/orders")

public class CustomOrderController {

        private final CustomOrderService customOrderService;

        @Autowired
        public CustomOrderController(CustomOrderService customOrderService) {
            this.customOrderService = customOrderService;
        }

        @PostMapping
        public ResponseEntity<CustomOrder> createOrder(@RequestBody CustomOrder customOrder) {
            CustomOrder createdOrder = customOrderService.createOrder(customOrder);
            return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
        }

        @GetMapping("/getById/{id}")
        public ResponseEntity<CustomOrder> getOrderById(@PathVariable Long id) {
            Optional<CustomOrder> customOrder = customOrderService.getOrderById(id);
            return customOrder.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        }

        @GetMapping
        public ResponseEntity<List<CustomOrder>> getAllOrders() {
            List<CustomOrder> orders = customOrderService.getAllOrders();
            return ResponseEntity.ok(orders);
        }

        @PutMapping("/update/{id}")
        public ResponseEntity<CustomOrder> updateOrder(@PathVariable Long id, @RequestBody CustomOrder customOrder) {
            CustomOrder updatedOrder = customOrderService.updateOrder(id, customOrder);
            return updatedOrder != null ? ResponseEntity.ok(updatedOrder)
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
            customOrderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        }
    // Example usage in a controller
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<CustomOrder> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam Long userId,
            @RequestParam OrderStatusType newStatus) {
        CustomOrder updatedOrder = customOrderService.updateOrderStatus(orderId, userId, newStatus);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CustomOrder>> getUserOrders(@PathVariable Long userId) {
        List<CustomOrder> orders = customOrderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }


    // Obtenir les commandes d'un utilisateur filtrées par statut
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<CustomOrder>> getUserOrdersByStatus(
            @PathVariable Long userId,
            @PathVariable OrderStatusType status
    ) {
        List<CustomOrder> orders = customOrderService.getUserOrdersByStatus(userId, status);
        return ResponseEntity.ok(orders);
    }
}
