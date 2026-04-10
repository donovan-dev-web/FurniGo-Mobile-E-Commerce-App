package com.furnigo.product.dto;

/** DTO représentant un produit exposé via l'API REST. */
public record ProductDto(
        String id,
        String name,
        String description,
        Double price,
        String imageUrl,
        String category) {
}