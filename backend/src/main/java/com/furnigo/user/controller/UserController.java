package com.furnigo.user.controller;

import com.furnigo.user.dto.UserExportResponse;
import com.furnigo.user.entity.User;
import com.furnigo.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Controller REST exposant les endpoints utilisateur et RGPD. */
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** GET /user/export — export RGPD des données utilisateur. */
    @GetMapping("/export")
    public ResponseEntity<UserExportResponse> exportUserData(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.exportUserData(currentUser));
    }

    /** DELETE /user — suppression et anonymisation du compte. */
    @DeleteMapping
    public ResponseEntity<Void> deleteAccount(
            @AuthenticationPrincipal User currentUser) {
        userService.deleteAccount(currentUser);
        return ResponseEntity.noContent().build();
    }
}