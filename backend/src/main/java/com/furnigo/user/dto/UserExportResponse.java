package com.furnigo.user.dto;

import java.util.List;

public record UserExportResponse(
        PersonalData donneesPersonnelles,
        List<PseudonymizedOrder> donneesPseudonymisees,
        AnonymizedStats donneesAnonymisees) {
}