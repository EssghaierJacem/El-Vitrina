package com.sudoers.elvitrinabackend.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StripeConfig {
    @Value("sk_test_51RCGti2LY1XqlaR4YJVjKUJlWlcmfV9i86Pbv4v7rtEpzRPJMSLDKlNV44jFB635oB6QcQaMBlS8KoKAntd2on1e00mo8aGBNG")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }
}
