package com.sudoers.elvitrinabackend.controller.CustomOrder;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.sudoers.elvitrinabackend.service.customOrder.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
public class StripeController {
    @Autowired
    private StripeService stripeService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> data) throws StripeException {
        Long amount = Long.parseLong(data.get("amount").toString());
        PaymentIntent intent = stripeService.createPaymentIntent(amount, "usd");

        Map<String, String> responseData = new HashMap<>();
        responseData.put("clientSecret", intent.getClientSecret());
        return ResponseEntity.ok(responseData);
    }
}
