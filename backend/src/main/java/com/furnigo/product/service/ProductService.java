package com.furnigo.product.service;

import com.furnigo.product.dto.ProductDto;
import com.furnigo.product.entity.Product;
import com.furnigo.product.repository.ProductRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.furnigo.common.exception.ResourceNotFoundException;

/** Service gérant la logique métier du catalogue produits. */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    /** Retourne tous les produits du catalogue. */
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    /** Retourne le détail d'un produit par son identifiant. */
    public ProductDto getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + id));
        return toDto(product);
    }

    private ProductDto toDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCoverImage(),
                product.getGalleryImages(),
                product.getCategory());
    }
}
