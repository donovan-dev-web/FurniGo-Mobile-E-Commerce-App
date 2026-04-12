package com.furnigo.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/** Payload attendu pour créer une commande. */
public record CreateOrderRequest(
        @NotEmpty(message = "La commande doit contenir au moins un article")
        List<@Valid CreateOrderItemRequest> items) {
}
