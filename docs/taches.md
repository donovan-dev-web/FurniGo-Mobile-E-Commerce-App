# Présentation des tâches

Retrouver l'ensemble de mes tâches avec une approche Agile.

[Voir toutes les tâches](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues)

## EPIC 1 — Infrastructure & Setup

| # | Titre | Labels | Milestone | liens |
|---|---|---|---|---|
| 1 | `[CHORE] Initialiser le projet Spring Boot` | `type: chore` `scope: backend` `priority: high` | MVP Backend Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/1) |
| 2 | `[CHORE] Configurer Docker Compose (backend + PostgreSQL)` | `type: chore` `scope: backend` `priority: high` | MVP Backend Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/2) |
| 3 | `[CHORE] Initialiser le projet Expo (React Native)` | `type: chore` `scope: mobile` `priority: high` | MVP Mobile Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/3) |
| 4 | `[CHORE] Configurer ESLint + TypeScript strict (mobile)` | `type: chore` `scope: mobile` | MVP Mobile Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/4) |
| 5 | `[CHORE] Configurer Checkstyle (backend)` | `type: chore` `scope: backend` | MVP Backend Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/5) |

---

## EPIC 2 — Authentification

| # | Titre | Labels | Milestone | liens |
|---|---|---|---|---|
| 6 | `[FEATURE] US-1 — Authentification Google OAuth2 (backend)` | `type: feature` `scope: backend` `scope: auth` `priority: high` | MVP Backend Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/6) |
| 7 | `[FEATURE] US-2 — Génération JWT après authentification` | `type: feature` `scope: backend` `scope: auth` `priority: high` | MVP Backend Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/7) |
| 8 | `[FEATURE] US-2 — Login Google via expo-auth-session (mobile)` | `type: feature` `scope: mobile` `scope: auth` `priority: high` | MVP Mobile Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/8) |
| 9 | `[FEATURE] US-3 — Déconnexion (suppression JWT local)` | `type: feature` `scope: mobile` `scope: auth` | MVP Mobile Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/9) |
| 10 | `[FEATURE] Sécurisation des routes API (Spring Security + JWT)` | `type: feature` `scope: backend` `scope: auth` `priority: high` | MVP Backend Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/10) |

---

## EPIC 3 — Produits

| # | Titre | Labels | Milestone | liens |
|---|---|---|---|---|
| 11 | `[FEATURE] US-6 — API liste produits (GET /products)` | `type: feature` `scope: backend` `priority: high` | MVP Backend Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/11) |
| 12 | `[FEATURE] US-7 — API détail produit (GET /products/{id})` | `type: feature` `scope: backend` | MVP Backend Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/12) |
| 13 | `[CHORE] Seed base de données avec produits de démonstration` | `type: chore` `scope: backend` | MVP Backend Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/13) |
| 14 | `[FEATURE] US-6 — Écran catalogue produits (mobile)` | `type: feature` `scope: mobile` | MVP Mobile Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/14) |
| 15 | `[FEATURE] US-7 — Écran détail produit (mobile)` | `type: feature` `scope: mobile` | MVP Mobile Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/15) |

---

## EPIC 4 — Panier

| # | Titre | Labels | Milestone | liens |
|---|---|---|---|---|
| 16 | `[FEATURE] US-9/10/11 — Gestion panier local avec Zustand` | `type: feature` `scope: mobile` | MVP Mobile Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/16) |
| 17 | `[FEATURE] US-12 — Calcul et affichage du total panier` | `type: feature` `scope: mobile` | MVP Mobile Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/17) |
| 18 | `[FEATURE] Persistance panier via AsyncStorage` | `type: feature` `scope: mobile` | MVP Mobile Core | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/18) |

---

## EPIC 5 — Commandes & Paiement

| # | Titre | Labels | Milestone | Statut actuel | liens |
|---|---|---|---|---|---|
| 19 | `[FEATURE] US-13 — API création commande (POST /orders)` | `type: feature` `scope: backend` `scope: payment` `priority: high` | MVP Backend Core | `implémentée et vérifiée` | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/19) |
| 20 | `[FEATURE] US-14 — Intégration Stripe Checkout Session` | `type: feature` `scope: backend` `scope: payment` `priority: high` | MVP Backend Core | `implémentée` | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/20) |
| 21 | `[FEATURE] US-14 — Webhook Stripe (payment_intent.succeeded)` | `type: feature` `scope: backend` `scope: payment` `priority: high` | MVP Backend Core | `implémentée` | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/21) |
| 22 | `[FEATURE] US-15 — Écran confirmation commande (mobile)` | `type: feature` `scope: mobile` `scope: payment` | MVP Mobile Core | `à faire` | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/22) |
| 23 | `[FEATURE] US-16 — Écran historique commandes (mobile)` | `type: feature` `scope: mobile` | MVP Mobile Core | `à faire` | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/23) |
| 24 | `[FEATURE] US-4 — Écran profil utilisateur (mobile)` | `type: feature` `scope: mobile` | MVP Mobile Core | `à faire` | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/24) |

---

## EPIC 6 — RGPD

| # | Titre | Labels | Milestone | liens |
|---|---|---|---|---|
| 25 | `[FEATURE] US-19 — Export données utilisateur JSON (GET /user/export)` | `type: feature` `scope: backend` `scope: rgpd` | RGPD & Qualité | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/25) |
| 26 | `[FEATURE] US-5/20 — Suppression compte et anonymisation (DELETE /user)` | `type: feature` `scope: backend` `scope: rgpd` | RGPD & Qualité | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/26) |
| 27 | `[FEATURE] Écran RGPD dans paramètres (mobile)` | `type: feature` `scope: mobile` `scope: rgpd` | RGPD & Qualité | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/27) |

---

## EPIC 7 — Tests

| # | Titre | Labels | Milestone | liens |
|---|---|---|---|---|
| 28 | `[TEST] Tests unitaires OrderService` | `type: test` `scope: backend` | RGPD & Qualité | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/28) |
| 29 | `[TEST] Tests unitaires PaymentService (Stripe webhook)` | `type: test` `scope: backend` | RGPD & Qualité | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/29) |
| 30 | `[TEST] Tests unitaires UserService (RGPD)` | `type: test` `scope: backend` | RGPD & Qualité | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/30) |

---

## EPIC 8 — Polish & Portfolio

| # | Titre | Labels | Milestone | liens |
|---|---|---|---|---|
| 31 | `[DOCS] README final avec screenshots et stack` | `type: docs` `scope: docs` | Polish & Portfolio Ready | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/31) |
| 32 | `[CHORE] Nettoyage code et suppression TODO restants` | `type: chore` | Polish & Portfolio Ready | [voir la tâche](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues/32) |

---
