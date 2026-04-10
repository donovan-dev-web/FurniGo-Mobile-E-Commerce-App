<div align="center">

# FurniGo

**Application mobile e-commerce fullstack — React Native × Spring Boot**

[![Backend CI](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/actions/workflows/backend-ci.yml)
[![Mobile CI](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/actions/workflows/mobile-ci.yml/badge.svg)](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/actions/workflows/mobile-ci.yml)
![Status](https://img.shields.io/badge/status-en%20développement-blue)
![Backend](https://img.shields.io/badge/backend-Spring%20Boot%203-6DB33F?logo=springboot&logoColor=white)
![Mobile](https://img.shields.io/badge/mobile-React%20Native%20%2F%20Expo-0B162A?logo=expo)
![Database](https://img.shields.io/badge/database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Payments](https://img.shields.io/badge/payments-Stripe-635BFF?logo=stripe&logoColor=white)
![Auth](https://img.shields.io/badge/auth-Google%20OAuth2-4285F4?logo=google&logoColor=white)
![Docker](https://img.shields.io/badge/infra-Docker-2496ED?logo=docker&logoColor=white)

<br/>

FurniGo est une application mobile e-commerce dédiée à la vente de mobilier moderne.  
Projet fullstack conçu comme démonstration technique avancée :  
architecture API robuste, paiement Stripe, authentification OAuth2 et conformité RGPD.

[📋 Kanban](https://github.com/users/donovan-dev-web/projects/4) · [🐛 Issues](https://github.com/donovan-dev-web/FurniGo-Mobile-E-Commerce-App/issues) · [📚 Documentation](#documentation) · [🎨 Maquettes](docs/maquettes.md)

</div>

---

## Pourquoi ce projet

Ce projet a été conçu avec un objectif clair : **démontrer la capacité à concevoir et livrer une application fullstack mobile complète**, en adoptant dès le départ les pratiques d'un environnement professionnel.

Chaque choix technique est documenté et justifié. Le projet est géré comme un vrai produit : backlog priorisé, issues liées aux Pull Requests, CI automatisée, convention de commits.

---

## Stack technique

| Couche | Technologie | Rôle |
|---|---|---|
| **Mobile** | React Native (Expo) | Application iOS / Android |
| **State** | Zustand + AsyncStorage | Gestion d'état et persistance locale |
| **Navigation** | React Navigation | Navigation entre écrans |
| **Auth mobile** | expo-auth-session | Authentification Google OAuth2 |
| **Backend** | Spring Boot 3 (Java 21) | API REST, logique métier |
| **Sécurité** | Spring Security + JWT | Authentification stateless |
| **Base de données** | PostgreSQL + JPA/Hibernate | Persistance relationnelle |
| **Paiement** | Stripe Checkout + Webhooks | Paiement sandbox |
| **Infra** | Docker + Docker Compose | Environnement local reproductible |
| **CI** | GitHub Actions | Build, tests et lint automatisés |

---

## Architecture

```
Mobile App (React Native / Expo)
        │
        │  HTTPS — REST + JWT
        ▼
Spring Boot API (monolithe modulaire)
   ┌────────────────────────────────────┐
   │  Auth │ User │ Product │ Order    │
   │  Payment │ RGPD │ Common          │
   └────────────────────────────────────┘
        │
        ├──► PostgreSQL
        │
        └──► Stripe API (sandbox)
                │
                └──► Webhook → mise à jour commande
```

L'architecture backend est un **monolithe modulaire** : séparation stricte par domaine métier (Auth, User, Product, Order, Payment, RGPD), architecture en couches Controller / Service / Repository / Entity / DTO.

---

## Fonctionnalités

### Authentification & Utilisateurs
- Connexion via Google OAuth2 (`expo-auth-session` → validation `id_token` backend)
- Génération JWT applicatif — sessions stateless
- Gestion de profil utilisateur
- Suppression de compte (RGPD)

### Catalogue & Panier
- Catalogue produits (liste + détail)
- Panier local persistant (Zustand + AsyncStorage)
- Calcul du total en temps réel
- Synchronisation panier → commande au checkout

### Commandes & Paiement
- Création de commande avec snapshot prix produit
- Stripe Checkout Session (mode sandbox)
- Webhook `payment_intent.succeeded` → mise à jour statut commande
- Historique des commandes par utilisateur

### RGPD
- Export des données personnelles (JSON)
- Suppression complète du compte
- Anonymisation des données transactionnelles

---

## Modèle de données

```
User ──────────────── Order ──────────── OrderItem
  │                     │                    │
  │ 1:N                 │ 1:N                │ N:1
  │                     ▼                    ▼
  └──────────────► OrderItem ◄───────── Product
                        │
                        │ 1:1
                        ▼
                     Payment
```

> Le prix unitaire est **figé au moment de la commande** (snapshot dans `OrderItem`),
> garantissant la cohérence de l'historique quel que soit l'évolution du catalogue.

---

## Flux paiement

```
Mobile ──► POST /orders ──► Spring Boot ──► Création Order (PENDING)
                                    │
                                    └──► Stripe: Create Checkout Session
                                                │
                                         URL Checkout ──► Mobile
                                                │
                                     Paiement utilisateur
                                                │
                                    Stripe ──► Webhook ──► Spring Boot
                                                              │
                                                    Update Order = PAID
```

---

## Lancer le projet

### Prérequis

- Java 21
- Node.js 20+
- Docker & Docker Compose
- Compte Stripe (clés sandbox)
- Projet Google Cloud (OAuth2 credentials)

### Backend

```bash
# Copier les variables d'environnement
cp backend/.env.example backend/.env
# Renseigner les valeurs dans backend/.env

# Lancer PostgreSQL + backend via Docker Compose
docker-compose up --build

# Le backend démarre sur http://localhost:8080
```

### Mobile

```bash
cd mobile

# Copier les variables d'environnement
cp .env.example .env
# Renseigner EXPO_PUBLIC_API_BASE_URL et EXPO_PUBLIC_GOOGLE_CLIENT_ID

npm install
npx expo start
```

---

## Décisions techniques notables

| Sujet | Décision | Justification |
|---|---|---|
| Architecture backend | Monolithe modulaire | Évite l'over-engineering pour un MVP portfolio |
| Auth mobile | `expo-auth-session` + validation `id_token` | Seule approche compatible Expo sans ejection |
| Panier | 100% local (AsyncStorage) | Simplifie l'architecture — synchronisation uniquement au checkout |
| JWT | Reconnexion forcée à expiration | Pas de refresh token en MVP — comportement documenté |
| Images produits | Volume Docker local | Cloudinary / S3 prévu en évolution post-MVP |
| Tests | JUnit 5 / Mockito sur couche Service | Priorité sur la logique métier critique |

---

## CI/CD

Deux pipelines GitHub Actions sont en place :

| Pipeline | Déclencheur | Jobs |
|---|---|---|
| `backend-ci.yml` | Push / PR sur `backend/**` | Compilation Maven, tests JUnit, Checkstyle |
| `mobile-ci.yml` | Push / PR sur `mobile/**` | Install, ESLint, TypeScript check, Expo Doctor |

Les workflows ne se déclenchent que si les fichiers de leur périmètre sont modifiés, évitant les exécutions inutiles.

---

## Workflow de développement

Ce projet suit un workflow Git structuré :

```
main        ← code stable (merge en fin de milestone)
develop     ← branche d'intégration
feature/*   ← développement de chaque feature
fix/*       ← corrections
```

Chaque fonctionnalité correspond à une **GitHub Issue** liée à une **Pull Request**, tracée dans le **Kanban GitHub Projects**.

Convention de commits : **Conventional Commits** (`feat:`, `fix:`, `chore:`, `test:`, `docs:`, `ci:`)

---

## Documentation

| Document | Contenu |
|---|---|
| [📋 Spécification fonctionnelle](docs/spec-fonctionnelle.md) | Périmètre, parcours utilisateur, règles métier |
| [⚙️ Spécification technique](docs/spec-technique.md) | Architecture, stack, flux, décisions techniques |
| [📊 Diagrammes](docs/diagrammes.md) | Flux auth, paiement, RGPD, modèle de données |
| [📖 User Stories](docs/user-stories.md) | Epics et critères d'acceptation |
| [✅ Tâches](docs/taches.md) | Backlog complet lié aux issues GitHub |
| [🎨 Maquettes](docs/maquettes.md) | Aperçu de tous les écrans (light & dark) |

---

## Roadmap

- [x] Documentation complète (spec fonctionnelle, technique, diagrammes, user stories)
- [x] Maquettes UI (light & dark — tous les écrans)
- [x] Configuration CI/CD (GitHub Actions)
- [x] Structure backend Spring Boot (modules)
- [x] Authentification Google OAuth2 (backend)
- [ ] API Produits
- [ ] API Commandes
- [ ] Intégration Stripe Checkout
- [ ] Application mobile React Native
- [ ] Tests unitaires (couche Service)
- [ ] RGPD (export + suppression)

---

## Auteur

**Donovan Chartrain** — Développeur Web Fullstack & Mobile

[![Portfolio](https://img.shields.io/badge/Portfolio-donovan--dev--web.vercel.app-black)](https://donovan-dev-web.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-donovan--dev--web-181717?logo=github)](https://github.com/donovan-dev-web)

> Projet réalisé dans une logique de portfolio technique avancé,  
> en ciblant les compétences recherchées sur le marché local (Java/Spring Boot, React Native).
