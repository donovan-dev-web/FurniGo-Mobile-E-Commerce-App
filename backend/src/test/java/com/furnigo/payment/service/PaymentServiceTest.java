package com.furnigo.payment.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.furnigo.common.exception.ResourceNotFoundException;
import com.furnigo.order.entity.Order;
import com.furnigo.order.entity.OrderItem;
import com.furnigo.order.entity.OrderStatus;
import com.furnigo.order.repository.OrderRepository;
import com.furnigo.payment.config.StripeProperties;
import com.furnigo.payment.dto.CheckoutSessionResponse;
import com.furnigo.user.entity.User;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private StripeProperties stripeProperties;

    @Mock
    private StripeGateway stripeGateway;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void should_create_checkout_session_for_pending_order() throws Exception {
        User user = User.builder().id("user-1").email("buyer@furnigo.com").build();
        Order order = buildOrder("order-1", user, OrderStatus.PENDING);
        Session session = new Session();
        session.setId("cs_test_123");
        session.setUrl("https://checkout.stripe.test/session");

        when(stripeProperties.getSecretKey()).thenReturn("sk_test_123");
        when(stripeProperties.getSuccessUrl()).thenReturn("https://example.com/success");
        when(stripeProperties.getCancelUrl()).thenReturn("https://example.com/cancel");
        when(orderRepository.findByIdAndUserId("order-1", "user-1")).thenReturn(Optional.of(order));
        when(stripeGateway.createCheckoutSession(
                org.mockito.ArgumentMatchers.any(SessionCreateParams.class),
                org.mockito.ArgumentMatchers.eq("checkout-session-order-1")))
                .thenReturn(session);

        CheckoutSessionResponse response = paymentService.createCheckoutSession(user, "order-1");

        assertEquals("order-1", response.orderId());
        assertEquals("cs_test_123", response.checkoutSessionId());
        assertEquals("https://checkout.stripe.test/session", response.checkoutUrl());
        assertEquals("cs_test_123", order.getStripeCheckoutSessionId());
    }

    @Test
    void should_reject_checkout_for_non_pending_order() {
        User user = User.builder().id("user-1").email("buyer@furnigo.com").build();
        Order order = buildOrder("order-1", user, OrderStatus.PAID);

        when(stripeProperties.getSecretKey()).thenReturn("sk_test_123");
        when(orderRepository.findByIdAndUserId("order-1", "user-1")).thenReturn(Optional.of(order));

        assertThrows(IllegalArgumentException.class,
                () -> paymentService.createCheckoutSession(user, "order-1"));
    }

    @Test
    void should_mark_order_as_paid_when_payment_intent_succeeds() throws Exception {
        Order order = buildOrder("order-1", User.builder().id("user-1").build(), OrderStatus.PENDING);

        PaymentIntent paymentIntent = new PaymentIntent();
        paymentIntent.setMetadata(Map.of("orderId", "order-1"));

        Event event = mock(Event.class);
        EventDataObjectDeserializer deserializer = mock(EventDataObjectDeserializer.class);

        when(event.getType()).thenReturn("payment_intent.succeeded");
        when(event.getDataObjectDeserializer()).thenReturn(deserializer);
        when(deserializer.getObject()).thenReturn(Optional.of((StripeObject) paymentIntent));

        when(stripeProperties.getWebhookSecret()).thenReturn("whsec_test");
        when(stripeGateway.constructEvent("payload", "signature", "whsec_test")).thenReturn(event);
        when(orderRepository.findById("order-1")).thenReturn(Optional.of(order));

        paymentService.handleWebhook("payload", "signature");

        assertEquals(OrderStatus.PAID, order.getStatus());
    }

    @Test
    void should_throw_when_webhook_targets_unknown_order() throws Exception {
        PaymentIntent paymentIntent = new PaymentIntent();
        paymentIntent.setMetadata(Map.of("orderId", "missing-order"));

        Event event = mock(Event.class);
        EventDataObjectDeserializer deserializer = mock(EventDataObjectDeserializer.class);

        when(event.getType()).thenReturn("payment_intent.succeeded");
        when(event.getDataObjectDeserializer()).thenReturn(deserializer);
        when(deserializer.getObject()).thenReturn(Optional.of((StripeObject) paymentIntent));

        when(stripeProperties.getWebhookSecret()).thenReturn("whsec_test");
        when(stripeGateway.constructEvent("payload", "signature", "whsec_test")).thenReturn(event);
        when(orderRepository.findById("missing-order")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> paymentService.handleWebhook("payload", "signature"));
    }

    private Order buildOrder(String orderId, User user, String status) {
        OrderItem item = OrderItem.builder()
                .productId("prod-1")
                .productName("Chaise")
                .unitPrice(149.99)
                .quantity(1)
                .build();

        Order order = Order.builder()
                .id(orderId)
                .user(user)
                .status(status)
                .totalAmount(149.99)
                .items(List.of(item))
                .build();
        item.setOrder(order);
        return order;
    }
}
