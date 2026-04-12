package com.furnigo.order.service;

import com.furnigo.common.exception.ResourceNotFoundException;
import com.furnigo.order.dto.CreateOrderItemRequest;
import com.furnigo.order.dto.CreateOrderRequest;
import com.furnigo.order.dto.OrderItemResponse;
import com.furnigo.order.dto.OrderResponse;
import com.furnigo.order.entity.Order;
import com.furnigo.order.entity.OrderItem;
import com.furnigo.order.entity.OrderStatus;
import com.furnigo.order.repository.OrderRepository;
import com.furnigo.product.entity.Product;
import com.furnigo.product.repository.ProductRepository;
import com.furnigo.user.entity.User;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/** Service métier de création des commandes. */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    /** Crée une commande pour l'utilisateur authentifié à partir des articles envoyés. */
    @Transactional
    public OrderResponse createOrder(User currentUser, CreateOrderRequest request) {
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0D;

        for (CreateOrderItemRequest requestItem : request.items()) {
            Product product = productRepository.findById(requestItem.productId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Produit introuvable: " + requestItem.productId()));

            double lineTotal = product.getPrice() * requestItem.quantity();
            totalAmount += lineTotal;

            orderItems.add(OrderItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .unitPrice(product.getPrice())
                    .quantity(requestItem.quantity())
                    .build());
        }

        if (orderItems.isEmpty()) {
            throw new IllegalArgumentException("La commande doit contenir au moins un article");
        }

        Order order = Order.builder()
                .user(currentUser)
                .status(OrderStatus.PENDING)
                .totalAmount(totalAmount)
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return toResponse(savedOrder);
    }

    private OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                order.getItems().stream()
                        .map(this::toItemResponse)
                        .toList());
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getProductId(),
                item.getProductName(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getUnitPrice() * item.getQuantity());
    }
}
