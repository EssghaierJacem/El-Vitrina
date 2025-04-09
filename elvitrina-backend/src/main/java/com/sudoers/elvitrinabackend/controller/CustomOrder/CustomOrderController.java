package com.sudoers.elvitrinabackend.controller.CustomOrder;

import com.sudoers.elvitrinabackend.model.entity.CustomOrder;
import com.sudoers.elvitrinabackend.service.customOrder.CustomOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")

@RestController

@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class CustomOrderController {

    private final CustomOrderService customOrderService;
    @GetMapping
    public List<CustomOrder> getAllOrders() {
                      return customOrderService.findAll();
                  }

    @GetMapping("/getById/{id}")
    public ResponseEntity<CustomOrder> getOrderById(@PathVariable Long id) {
        return customOrderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CustomOrder> createOrder(@RequestBody CustomOrder order) {
        return ResponseEntity.ok(customOrderService.saveCustomOrder(order));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CustomOrder> updateOrder(@PathVariable Long id, @RequestBody CustomOrder updatedOrder) {
        return ResponseEntity.ok(customOrderService.update(id, updatedOrder));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        customOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
