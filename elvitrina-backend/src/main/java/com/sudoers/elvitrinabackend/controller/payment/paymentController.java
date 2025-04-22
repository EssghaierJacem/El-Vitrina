package com.sudoers.elvitrinabackend.controller.payment;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.sudoers.elvitrinabackend.model.dto.PaymentDTO;
import com.sudoers.elvitrinabackend.model.entity.Payment;
import com.sudoers.elvitrinabackend.service.payment.PaymentService;
import com.sudoers.elvitrinabackend.service.payment.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/payments")
public class paymentController {

    private final StripeService stripeService;
    private final PaymentService paymentService;

    public paymentController(PaymentService paymentService, StripeService stripeService) {
        this.paymentService = paymentService;
        this.stripeService = stripeService;
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

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, Object> data) {
        try {
            int amount = (int) data.get("amount");

            Stripe.apiKey = "sk_test_51RCGti2LY1XqlaR4YJVjKUJlWlcmfV9i86Pbv4v7rtEpzRPJMSLDKlNV44jFB635oB6QcQaMBlS8KoKAntd2on1e00mo8aGBNG"; // ta clé secrète Stripe

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:4200/success")
                    .setCancelUrl("http://localhost:4200/cancel")
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("eur")
                                                    .setUnitAmount((long) amount) // montant en centimes
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Paiement")
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);
            Map<String, String> responseData = new HashMap<>();
            responseData.put("url", session.getUrl());

            return ResponseEntity.ok(responseData);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<Payment> updateStatus(@PathVariable Long id) {
        Payment payment = paymentService.updateStatusToSuccess(id);
        return ResponseEntity.ok(payment);
    }

}
