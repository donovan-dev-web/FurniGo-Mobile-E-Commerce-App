package com.furnigo.payment.service;

import com.furnigo.common.exception.ResourceNotFoundException;
import com.furnigo.order.entity.Order;
import com.furnigo.order.entity.OrderItem;
import com.furnigo.order.entity.OrderStatus;
import com.furnigo.order.repository.OrderRepository;
import com.furnigo.payment.config.StripeProperties;
import com.furnigo.payment.dto.CheckoutSessionResponse;
import com.furnigo.user.entity.User;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.transaction.Transactional;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/** Service métier gérant Checkout Stripe et la mise à jour des commandes. */
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final StripeProperties stripeProperties;
    private final StripeGateway stripeGateway;

    /** Crée une session Stripe Checkout pour une commande en attente. */
    @Transactional
    public CheckoutSessionResponse createCheckoutSession(User currentUser, String orderId)
            throws StripeException {
        validateStripeSecretKey();

        Order order = orderRepository.findByIdAndUserId(orderId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Commande introuvable: " + orderId));

        if (!Objects.equals(OrderStatus.PENDING, order.getStatus())) {
            throw new IllegalArgumentException(
                    "Seules les commandes PENDING peuvent être payées");
        }

        if (stripeGateway instanceof DefaultStripeGateway defaultStripeGateway) {
            defaultStripeGateway.setApiKey(stripeProperties.getSecretKey());
        }

        Session session = stripeGateway.createCheckoutSession(
                buildSessionParams(order, currentUser.getEmail()),
                "checkout-session-" + order.getId());

        order.setStripeCheckoutSessionId(session.getId());

        return new CheckoutSessionResponse(order.getId(), session.getId(), session.getUrl());
    }

    /** Traite un webhook Stripe et synchronise le statut de la commande. */
    @Transactional
    public void handleWebhook(String payload, String signatureHeader)
            throws SignatureVerificationException {
        validateWebhookSecret();

        Event event = stripeGateway.constructEvent(
                payload,
                signatureHeader,
                stripeProperties.getWebhookSecret());

        if ("payment_intent.succeeded".equals(event.getType())) {
            updateOrderStatusFromPaymentIntent(event, OrderStatus.PAID);
        } else if ("payment_intent.payment_failed".equals(event.getType())) {
            updateOrderStatusFromPaymentIntent(event, OrderStatus.FAILED);
        }
    }

    private SessionCreateParams buildSessionParams(Order order, String customerEmail) {
        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(stripeProperties.getSuccessUrl())
                .setCancelUrl(stripeProperties.getCancelUrl())
                .setClientReferenceId(order.getId())
                .putMetadata("orderId", order.getId())
                .putMetadata("userId", order.getUser().getId())
                .setCustomerEmail(customerEmail);

        for (OrderItem item : order.getItems()) {
            builder.addLineItem(SessionCreateParams.LineItem.builder()
                    .setQuantity(Long.valueOf(item.getQuantity()))
                    .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("eur")
                            .setUnitAmount(toStripeAmount(item.getUnitPrice()))
                            .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(item.getProductName())
                                    .putMetadata("productId", item.getProductId())
                                    .build())
                            .build())
                    .build());
        }

        builder.setPaymentIntentData(SessionCreateParams.PaymentIntentData.builder()
                .putMetadata("orderId", order.getId())
                .putMetadata("userId", order.getUser().getId())
                .build());

        return builder.build();
    }

    private void updateOrderStatusFromPaymentIntent(Event event, String newStatus) {
        StripeObject stripeObject = event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow(() -> new IllegalArgumentException("Payload Stripe invalide"));

        if (!(stripeObject instanceof PaymentIntent paymentIntent)) {
            throw new IllegalArgumentException("L'événement Stripe ne contient pas de PaymentIntent");
        }

        String orderId = paymentIntent.getMetadata().get("orderId");
        if (!StringUtils.hasText(orderId)) {
            throw new IllegalArgumentException("Le metadata orderId est manquant");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Commande introuvable: " + orderId));

        if (!Objects.equals(order.getStatus(), newStatus)) {
            order.setStatus(newStatus);
        }
    }

    private Long toStripeAmount(Double amount) {
        return Math.round(amount * 100);
    }

    private void validateStripeSecretKey() {
        if (!StringUtils.hasText(stripeProperties.getSecretKey())) {
            throw new IllegalStateException("La clé Stripe secrète n'est pas configurée");
        }
    }

    private void validateWebhookSecret() {
        if (!StringUtils.hasText(stripeProperties.getWebhookSecret())) {
            throw new IllegalStateException("Le secret webhook Stripe n'est pas configuré");
        }
    }
}
