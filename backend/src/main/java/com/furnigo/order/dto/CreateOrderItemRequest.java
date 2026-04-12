package com.furnigo.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/** Ligne de commande envoyée lors de la création d'une commande. */
public record CreateOrderItemRequest(
        @NotBlank(message = "Le productId est obligatoire")
        String productId,

        @Min(value = 1, message = "La quantité doit être supérieure à 0")
        int quantity) {
}
