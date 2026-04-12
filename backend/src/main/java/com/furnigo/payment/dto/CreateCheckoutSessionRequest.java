package com.furnigo.payment.dto;

import jakarta.validation.constraints.NotBlank;

/** Payload attendu pour démarrer un paiement Stripe sur une commande. */
public record CreateCheckoutSessionRequest(
        @NotBlank(message = "Le orderId est obligatoire")
        String orderId) {
}
