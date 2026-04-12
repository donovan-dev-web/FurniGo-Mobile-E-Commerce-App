package com.furnigo.order.repository;

import com.furnigo.order.entity.Order;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repository JPA pour l'accès aux commandes. */
public interface OrderRepository extends JpaRepository<Order, String> {

    /** Retourne une commande appartenant à un utilisateur donné. */
    Optional<Order> findByIdAndUserId(String id, String userId);

    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
}
