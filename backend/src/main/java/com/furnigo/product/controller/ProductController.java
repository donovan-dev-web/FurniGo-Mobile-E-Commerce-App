package com.furnigo.product.controller;

import com.furnigo.product.dto.ProductDto;
import com.furnigo.product.service.ProductService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Controller REST exposant les endpoints du catalogue produits. */
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /** GET /products — retourne la liste complète des produits. */
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    /** GET /products/{id} — retourne le détail d'un produit. */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}