package com.furnigo.user.dto;

import java.time.LocalDateTime;

public record PseudonymizedOrder(
        String orderId,
        String status,
        Double totalAmount,
        LocalDateTime createdAt) {
}