package com.furnigo.product.repository;

import com.furnigo.product.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repository JPA pour l'accès aux produits en base. */
public interface ProductRepository extends JpaRepository<Product, String> {

    /** Retourne les produits filtrés par catégorie. */
    List<Product> findByCategory(String category);
}