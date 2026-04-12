package com.furnigo.payment.service;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

/** Port d'accès à Stripe pour faciliter les tests. */
public interface StripeGateway {

    /** Crée une session Checkout Stripe. */
    Session createCheckoutSession(SessionCreateParams params, String idempotencyKey) throws StripeException;

    /** Construit un événement Stripe après vérification de signature. */
    Event constructEvent(String payload, String signatureHeader, String webhookSecret)
            throws SignatureVerificationException;
}
