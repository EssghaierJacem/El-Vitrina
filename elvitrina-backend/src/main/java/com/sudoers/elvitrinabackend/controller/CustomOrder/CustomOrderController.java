package com.sudoers.elvitrinabackend.controller.CustomOrder;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.service.customOrder.CustomOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

        @GetMapping("/{id}")
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

        @PutMapping("/{id}")
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
}
