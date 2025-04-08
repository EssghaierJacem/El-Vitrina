package com.sudoers.elvitrinabackend.controller.CustomOrder;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.model.enums.OrderStatusType;
import com.sudoers.elvitrinabackend.service.customOrder.CustomOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")

@RestController

@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class CustomOrderController {

    private final CustomOrderService customOrderService;

    @PostMapping
    public ResponseEntity<CustomOrder> createOrder(@RequestBody CustomOrder customOrder) {
        CustomOrder createdOrder = customOrderService.createOrder(customOrder);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomOrder> getOrderById(@PathVariable Long id) {
        Optional<CustomOrder> order = customOrderService.getOrderById(id);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/all")
    public ResponseEntity<List<CustomOrder>> getAllOrders() {
        List<CustomOrder> orders = customOrderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomOrder> updateOrder(@PathVariable Long id, @RequestBody CustomOrder customOrder) {
        CustomOrder updated = customOrderService.updateOrder(id, customOrder);
        return updated != null ? ResponseEntity.ok(updated)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        customOrderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<CustomOrder> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam Long userId,
            @RequestParam OrderStatusType newStatus) {
        try {
            CustomOrder updatedOrder = customOrderService.updateOrderStatus(orderId, userId, newStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CustomOrder>> getOrdersByUser(@PathVariable Long userId) {
        List<CustomOrder> orders = customOrderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<CustomOrder>> getUserOrdersByStatus(
            @PathVariable Long userId,
            @PathVariable OrderStatusType status) {
        List<CustomOrder> orders = customOrderService.getUserOrdersByStatus(userId, status);
        return ResponseEntity.ok(orders);
    }
    @PostMapping("/{orderId}/addProduct/{productId}")
    public ResponseEntity<CustomOrder> addProduct(@PathVariable Long orderId, @PathVariable Long productId) {
        CustomOrder updatedOrder = customOrderService.addProductToOrder(orderId, productId);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{orderId}/removeProduct/{productId}")
    public ResponseEntity<CustomOrder> removeProduct(@PathVariable Long orderId, @PathVariable Long productId) {
        CustomOrder updatedOrder = customOrderService.removeProductFromOrder(orderId, productId);
        return ResponseEntity.ok(updatedOrder);
    }

    @PostMapping("/create-with-user/{userId}")
    public ResponseEntity<CustomOrder> createOrderWithUser(@PathVariable Long userId, @RequestBody CustomOrder order) {
        CustomOrder savedOrder = customOrderService.createOrderWithUser(order, userId);
        return ResponseEntity.ok(savedOrder);
    }
}
