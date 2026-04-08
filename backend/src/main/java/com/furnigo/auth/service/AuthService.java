package com.furnigo.auth.service;

import com.furnigo.auth.dto.AuthResponse;
import com.furnigo.auth.dto.GoogleAuthRequest;
import com.furnigo.common.security.JwtService;
import com.furnigo.user.entity.User;
import com.furnigo.user.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) {
        GoogleIdToken.Payload payload = verifyGoogleToken(request.idToken());

        String providerId = payload.getSubject();
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        User user = userRepository
                .findByProviderAndProviderId("GOOGLE", providerId)
                .orElseGet(() -> createUser(email, name, providerId));

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getName());
    }

    // --- private ---

    private GoogleIdToken.Payload verifyGoogleToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken token = verifier.verify(idToken);
            if (token == null) {
                throw new IllegalArgumentException("Token Google invalide ou expiré");
            }
            return token.getPayload();

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la validation du token Google : " + e.getMessage());
        }
    }

    private User createUser(String email, String name, String providerId) {
        return userRepository.save(
                User.builder()
                        .email(email)
                        .name(name)
                        .provider("GOOGLE")
                        .providerId(providerId)
                        .build());
    }
}