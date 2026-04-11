package com.furnigo.order.repository;

import com.furnigo.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repository JPA pour l'accès aux commandes. */
public interface OrderRepository extends JpaRepository<Order, String> {
}
