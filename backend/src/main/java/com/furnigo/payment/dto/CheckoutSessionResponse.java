package com.furnigo.payment.dto;

/** Réponse renvoyée au mobile pour lancer le Checkout Stripe. */
public record CheckoutSessionResponse(
        String orderId,
        String checkoutSessionId,
        String checkoutUrl) {
}
