package com.sudoers.elvitrinabackend.controller.payment;

import com.sudoers.elvitrinabackend.model.dto.PaymentDTO;
import com.sudoers.elvitrinabackend.service.payment.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:51937")
@RestController
@RequestMapping("/api/payments")
public class paymentController {

    private final PaymentService paymentService;

    public paymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody PaymentDTO paymentDTO) {
        return ResponseEntity.ok(paymentService.createPayment(paymentDTO));
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Long id) {
        Optional<PaymentDTO> paymentDTO = paymentService.getPaymentById(id);
        return paymentDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/list")
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PaymentDTO> updatePayment(@PathVariable Long id, @RequestBody PaymentDTO paymentDTO) {
        return ResponseEntity.ok(paymentService.updatePayment(id, paymentDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/process")
    public ResponseEntity<PaymentDTO> processPayment(
            @RequestParam Long orderId,
            @RequestParam double amount,
            @RequestParam String paymentMethod) {

        PaymentDTO paymentDTO = paymentService.processPayment(orderId, amount, paymentMethod);
        return ResponseEntity.ok(paymentDTO);
    }

    @PostMapping("/validate/{paymentId}")
    public ResponseEntity<PaymentDTO> validatePayment(@PathVariable Long paymentId) {
        try {
            PaymentDTO validatedPayment = paymentService.validatePayment(paymentId);
            return ResponseEntity.ok(validatedPayment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
