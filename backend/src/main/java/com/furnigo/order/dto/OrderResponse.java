package com.furnigo.order.dto;

import java.time.LocalDateTime;
import java.util.List;

/** Réponse renvoyée après création d'une commande. */
public record OrderResponse(
        String id,
        String userId,
        String status,
        Double totalAmount,
        LocalDateTime createdAt,
        List<OrderItemResponse> items) {
}
