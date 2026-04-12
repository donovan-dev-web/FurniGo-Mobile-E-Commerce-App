package com.furnigo.order.dto;

/** Ligne renvoyée dans la réponse de création de commande. */
public record OrderItemResponse(
        String productId,
        String productName,
        Double unitPrice,
        int quantity,
        Double lineTotal) {
}
