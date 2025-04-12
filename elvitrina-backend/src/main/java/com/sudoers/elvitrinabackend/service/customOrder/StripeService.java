package com.sudoers.elvitrinabackend.service.customOrder;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StripeService {
    @Value("sk_test_51RCGti2LY1XqlaR4YJVjKUJlWlcmfV9i86Pbv4v7rtEpzRPJMSLDKlNV44jFB635oB6QcQaMBlS8KoKAntd2on1e00mo8aGBNG")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public PaymentIntent createPaymentIntent(Long amount, String currency) throws StripeException {
        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount); // en cents
        params.put("currency", currency);
        params.put("payment_method_types", List.of("card"));
        return PaymentIntent.create(params);
    }
}