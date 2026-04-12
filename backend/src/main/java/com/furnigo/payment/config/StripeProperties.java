package com.furnigo.payment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Configuration applicative de l'intégration Stripe. */
@Component
public class StripeProperties {

    private final String secretKey;
    private final String webhookSecret;
    private final String successUrl;
    private final String cancelUrl;

    public StripeProperties(
            @Value("${stripe.secret-key:}") String secretKey,
            @Value("${stripe.webhook-secret:}") String webhookSecret,
            @Value("${app.payment.success-url}") String successUrl,
            @Value("${app.payment.cancel-url}") String cancelUrl) {
        this.secretKey = secretKey;
        this.webhookSecret = webhookSecret;
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public String getWebhookSecret() {
        return webhookSecret;
    }

    public String getSuccessUrl() {
        return successUrl;
    }

    public String getCancelUrl() {
        return cancelUrl;
    }
}
