package com.furnigo.order.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.furnigo.common.exception.ResourceNotFoundException;
import com.furnigo.order.dto.CreateOrderItemRequest;
import com.furnigo.order.dto.CreateOrderRequest;
import com.furnigo.order.dto.OrderResponse;
import com.furnigo.order.entity.Order;
import com.furnigo.order.repository.OrderRepository;
import com.furnigo.product.entity.Product;
import com.furnigo.product.repository.ProductRepository;
import com.furnigo.user.entity.User;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void should_create_order_when_cart_is_valid() {
        User user = User.builder().id("user-1").email("buyer@furnigo.com").build();
        Product chair = Product.builder().id("prod-1").name("Chaise").price(149.99).build();
        CreateOrderRequest request = new CreateOrderRequest(List.of(
                new CreateOrderItemRequest("prod-1", 2)));

        when(productRepository.findById("prod-1")).thenReturn(Optional.of(chair));
        when(orderRepository.save(org.mockito.ArgumentMatchers.any(Order.class)))
                .thenAnswer(invocation -> {
                    Order order = invocation.getArgument(0);
                    order.setId("order-1");
                    return order;
                });

        OrderResponse response = orderService.createOrder(user, request);

        assertEquals("order-1", response.id());
        assertEquals("user-1", response.userId());
        assertEquals("PENDING", response.status());
        assertEquals(299.98, response.totalAmount());
        assertEquals(1, response.items().size());
        verify(orderRepository).save(org.mockito.ArgumentMatchers.any(Order.class));
    }

    @Test
    void should_throw_exception_when_product_does_not_exist() {
        User user = User.builder().id("user-1").build();
        CreateOrderRequest request = new CreateOrderRequest(List.of(
                new CreateOrderItemRequest("missing-product", 1)));

        when(productRepository.findById("missing-product")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.createOrder(user, request));
    }
}
