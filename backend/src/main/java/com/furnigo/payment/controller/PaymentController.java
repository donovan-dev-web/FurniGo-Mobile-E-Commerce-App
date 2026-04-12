package com.furnigo.payment.controller;

import com.furnigo.payment.dto.CheckoutSessionResponse;
import com.furnigo.payment.dto.CreateCheckoutSessionRequest;
import com.furnigo.payment.service.PaymentService;
import com.furnigo.user.entity.User;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints REST pour démarrer un paiement et recevoir le webhook Stripe. */
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private static final String STRIPE_SIGNATURE_HEADER = "Stripe-Signature";

    private final PaymentService paymentService;

    /** POST /payments/checkout-session — crée une session Checkout sur une commande existante. */
    @PostMapping("/checkout-session")
    public ResponseEntity<CheckoutSessionResponse> createCheckoutSession(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateCheckoutSessionRequest request) throws StripeException {
        return ResponseEntity.ok(paymentService.createCheckoutSession(currentUser, request.orderId()));
    }

    /** POST /payments/webhook — traite les événements de paiement Stripe. */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, String>> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(STRIPE_SIGNATURE_HEADER) String stripeSignature)
            throws SignatureVerificationException {
        paymentService.handleWebhook(payload, stripeSignature);
        return ResponseEntity.ok(Map.of("message", "Webhook Stripe traité"));
    }
}
