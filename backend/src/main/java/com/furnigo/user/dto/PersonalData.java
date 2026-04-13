package com.furnigo.user.dto;

import java.time.LocalDateTime;

public record PersonalData(
        String nom,
        String email,
        String provider,
        LocalDateTime dateCreation) {
}