package com.furnigo.user.service;

import com.furnigo.order.entity.Order;
import com.furnigo.order.repository.OrderRepository;
import com.furnigo.user.dto.AnonymizedStats;
import com.furnigo.user.dto.PersonalData;
import com.furnigo.user.dto.PseudonymizedOrder;
import com.furnigo.user.dto.UserExportResponse;
import com.furnigo.user.entity.User;
import com.furnigo.user.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Service métier gérant les données utilisateur et les opérations RGPD. */
@Service
@RequiredArgsConstructor
public class UserService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    /** Exporte toutes les données de l'utilisateur classées par type. */
    public UserExportResponse exportUserData(User currentUser) {
        List<Order> orders = orderRepository
                .findByUserIdOrderByCreatedAtDesc(currentUser.getId());

        PersonalData personal = new PersonalData(
                currentUser.getName(),
                currentUser.getEmail(),
                currentUser.getProvider(),
                currentUser.getCreatedAt());

        List<PseudonymizedOrder> pseudonymized = orders.stream()
                .map(o -> new PseudonymizedOrder(
                        o.getId(),
                        o.getStatus(),
                        o.getTotalAmount(),
                        o.getCreatedAt()))
                .toList();

        AnonymizedStats stats = new AnonymizedStats(
                orders.size(),
                orders.stream().mapToDouble(Order::getTotalAmount).sum());

        return new UserExportResponse(personal, pseudonymized, stats);
    }

    /** Anonymise les commandes puis supprime le compte utilisateur. */
    @Transactional
    public void deleteAccount(User currentUser) {
        List<Order> orders = orderRepository
                .findByUserIdOrderByCreatedAtDesc(currentUser.getId());

        orders.forEach(order -> {
            order.setUser(null);
            order.setAnonymized(true);
        });
        orderRepository.saveAll(orders);

        userRepository.delete(currentUser);
    }
}