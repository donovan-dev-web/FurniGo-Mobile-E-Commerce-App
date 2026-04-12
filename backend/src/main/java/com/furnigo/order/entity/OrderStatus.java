package com.furnigo.order.entity;

/** Statuts métier possibles d'une commande. */
public final class OrderStatus {

    public static final String PENDING = "PENDING";
    public static final String PAID = "PAID";
    public static final String FAILED = "FAILED";

    private OrderStatus() {
    }
}
