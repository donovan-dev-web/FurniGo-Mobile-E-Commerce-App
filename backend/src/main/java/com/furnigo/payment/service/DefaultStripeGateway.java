package com.furnigo.payment.service;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.stereotype.Component;

/** Implémentation Stripe réelle basée sur le SDK officiel. */
@Component
public class DefaultStripeGateway implements StripeGateway {

    @Override
    public Session createCheckoutSession(SessionCreateParams params, String idempotencyKey)
            throws StripeException {
        RequestOptions requestOptions = RequestOptions.builder()
                .setIdempotencyKey(idempotencyKey)
                .build();
        return Session.create(params, requestOptions);
    }

    @Override
    public Event constructEvent(String payload, String signatureHeader, String webhookSecret)
            throws SignatureVerificationException {
        return Webhook.constructEvent(payload, signatureHeader, webhookSecret);
    }

    /** Initialise la clé API Stripe au démarrage des appels de paiement. */
    public void setApiKey(String secretKey) {
        Stripe.apiKey = secretKey;
    }
}
