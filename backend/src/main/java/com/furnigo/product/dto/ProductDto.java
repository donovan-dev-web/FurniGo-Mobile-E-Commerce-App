package com.furnigo.product.dto;

import java.util.List;

/** DTO représentant un produit exposé via l'API REST. */
public record ProductDto(
        String id,
        String name,
        String description,
        Double price,
        String coverImage,
        List<String> galleryImages,
        String category) {
}
