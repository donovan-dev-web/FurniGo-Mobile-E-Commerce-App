# FurniGo — Spécification Technique

---

# 1. Vue d’ensemble de l’architecture

FurniGo repose sur une architecture **monolithique modulaire backend** couplée à une application mobile.

## Architecture globale

Mobile App (React Native - Expo)
            ↓
     API Backend (Spring Boot)
            ↓
      PostgreSQL Database
            ↓
      Stripe API (paiement)

---

# 2. Architecture backend

## 2.1 Type d’architecture

* Monolithe modulaire
* Séparation par domaines métier
* Architecture en couches

---

## 2.2 Modules backend

Le backend est découpé en modules indépendants :

* Auth (sécurité / OAuth2)
* User (gestion utilisateurs)
* Product (catalogue)
* Cart (logique panier si nécessaire côté API future)
* Order (commandes)
* Payment (Stripe)
* Common (exceptions, utils, config globale)

---

##  2.3 Architecture en couches

Chaque module suit une architecture standard :

* Controller (REST endpoints)
* Service (logique métier)
* Repository (accès base de données)
* Entity (modèle JPA)
* DTO (transfert de données)

---

#  3. Authentification & sécurité

## 3.1 Authentification

* OAuth2 Google Login
* Spring Security
* Génération de JWT après authentification

---

## 3.2 Gestion des sessions

* Auth stateless via JWT
* Token stocké côté mobile
* Validation des requêtes via filtre Spring Security

---

## 3.3 Sécurisation des routes

* Routes publiques :

  * catalogue produits
  * login OAuth

* Routes protégées :

  * profil utilisateur
  * commandes
  * RGPD
  * paiement

---

# 4. Gestion des utilisateurs

## 4.1 Création utilisateur

* Création automatique lors du premier login Google
* Mapping des données OAuth vers entité User

---

## 4.2 Structure utilisateur

Un utilisateur contient :

* id unique
* email
* nom
* provider (GOOGLE)
* providerId
* rôle (USER / ADMIN optionnel)
* dates de création

---

# 5. Gestion des produits

## 5.1 API produits

Endpoints principaux :

* liste produits
* détail produit
* filtrage simple (optionnel)

---

## 5.2 Modèle produit

* id
* nom
* description
* prix
* images
* catégorie (optionnel)

---

##  5.3 Règle métier importante

 Le prix est **figé au moment de la commande** (snapshot)

---

### 5.4 Stockage des images produits

Les images produits sont gérées via un **volume Docker monté localement** en environnement de développement.

**Stratégie développement (MVP) :**

- Les images sont stockées dans un dossier `uploads/` monté en volume Docker
- Spring Boot expose un endpoint statique pour servir les fichiers
- Les chemins sont stockés en base sous forme de chemins relatifs

```
/uploads/products/
  ├── sofa-001.jpg
  ├── table-002.jpg
  └── chair-003.jpg
```

**Configuration Spring Boot :**

```java
// Exposition du dossier uploads comme ressource statique
// via WebMvcConfigurer — à configurer dans le module Common
```

**Contraintes MVP :**

- Pas de redimensionnement automatique (images pré-formatées)
- Pas de CDN
- Pas de validation de type MIME avancée

**Évolutions prévues (post-MVP) :**

- Migration vers **Cloudinary** ou **AWS S3** pour le stockage cloud
- Génération de thumbnails
- Validation et optimisation automatique des images à l'upload

---


#  6. Commandes

## 6.1 Création de commande

Une commande est créée à partir :

* du panier mobile
* des données utilisateur
* des produits sélectionnés

---

## 6.2 Structure commande

* id
* userId
* totalAmount
* status (PENDING / PAID / FAILED)
* orderItems

---

## 6.3 OrderItem

* productId
* productName (snapshot)
* quantity
* unitPrice (snapshot)

---

##  6.4 Règle métier critique

 Une commande validée est immuable

---

#  7. Paiement Stripe

## 7.1 Flow global

Mobile → Backend → Stripe Checkout → User Payment → Stripe Webhook → Backend → Update Order

---

## 7.2 Stripe Checkout Session

* création session côté backend
* redirection vers Stripe Checkout
* paiement en mode sandbox

---

## 7.3 Webhook Stripe

Le backend écoute les événements :

* payment_success
* payment_failed

Actions :

* mise à jour statut commande
* confirmation utilisateur

---

## 7.4 Sécurité Stripe

* validation signature webhook
* idempotency des événements
* protection contre doublons

---

# 8. Base de données (PostgreSQL)

## 8.1 ORM

* Hibernate / JPA

---

## 8.2 Tables principales

* users
* products
* orders
* order_items
* payments

---

## 8.3 Relations

* User → Orders (1:N)
* Order → OrderItems (1:N)
* Order → Payment (1:1)

---

## 8.4 Stratégie données RGPD

* suppression logique (soft delete possible)
* anonymisation des commandes
* séparation données sensibles / transactionnelles

---

# 9. RGPD (implémentation technique)

## 9.1 Export des données

* génération JSON utilisateur
* inclut :

  * profil
  * commandes
  * historique

---

## 9.2 Suppression des données

Deux stratégies :

* suppression complète utilisateur
* anonymisation des données liées aux commandes

---

## 9.3 Classification des données

* données utilisateur (PII)
* données pseudonymisées (Stripe / orders)
* données anonymisées (analytics)

---

# 10. Application mobile (React Native)

## 10.1 Stack

* React Native (Expo)
* Zustand (state management)
* React Navigation
* AsyncStorage (persistance locale)

---

## 10.2 Gestion du panier

* stockage local uniquement
* persistance via AsyncStorage
* synchronisation uniquement lors de création commande

---

## 10.3 Communication API

* Axios / Fetch
* JWT dans headers Authorization

---

## 10.4 Flux applicatif

* login Google
* récupération token JWT
* appels API sécurisés
* gestion état global côté client

---

# 11. Infrastructure

## 11.1 Docker

Services containerisés :

* Spring Boot backend
* PostgreSQL database

---

## 11.2 Docker Compose

* orchestration locale
* environnement de développement reproductible

---

# 12. Flux principaux

## 12.1 Parcours utilisateur

Login Google
→ Catalogue produits
→ Ajout panier
→ Création commande
→ Stripe checkout
→ Webhook confirmation
→ Historique commande

---

## 12.2 Flux paiement

Order CREATED
→ Stripe Session created
→ Payment completed
→ Webhook received
→ Order updated to PAID

---

# 13. Contraintes techniques

* API stateless (JWT)
* architecture modulaire obligatoire
* séparation stricte des responsabilités
* prix figé côté backend
* sécurité webhook Stripe obligatoire

---

# 14. Évolutions possibles

* migration vers microservices
* ajout Redis cache
* admin dashboard
* notifications push
* analytics utilisateur
* système de coupons

# 15. Stratégie de test

## 15.1 Tests backend (Spring Boot)

### Framework

- **JUnit 5** — framework de test principal
- **Mockito** — mocking des dépendances
- **Spring Boot Test** — contexte de test Spring

### Périmètre ciblé

Les tests portent prioritairement sur la **couche Service**, qui concentre la logique métier.

```
Couche testée       : Service (OrderService, PaymentService, UserService)
Couche mockée       : Repository, Stripe API, Google Token Verification
Couche non testée   : Controller (testé manuellement via Postman/Swagger)
```

### Exemples de cas testés

- création d'une commande à partir d'un panier valide
- rejet d'une commande si panier vide
- mise à jour du statut commande sur réception webhook Stripe
- suppression / anonymisation des données utilisateur (RGPD)
- validation de la signature webhook Stripe

### Nommage des tests

Convention : `should_[résultat attendu]_when_[condition]`

```java
// Exemple
@Test
void should_create_order_when_cart_is_valid() { ... }

@Test
void should_throw_exception_when_cart_is_empty() { ... }
```

---

## 15.2 Tests mobile (React Native / Expo)

### Statut MVP

Les tests automatisés ne sont **pas inclus dans le périmètre MVP** du projet mobile.

La couverture mobile sera ajoutée dans une phase ultérieure avec :

- **Jest** — framework de test
- **React Native Testing Library** — tests de composants
- Focus sur les composants critiques : panier, flux de paiement, authentification

---

## 15.3 Tests manuels

Les flows suivants sont validés manuellement via **Postman** (backend) et directement sur simulateur (mobile) :

- Authentification Google complète (expo-auth-session → JWT)
- Création de commande et paiement Stripe sandbox
- Réception et traitement du webhook Stripe
- Export et suppression des données RGPD


# 16. CI/CD & Workflow de développement

## 16.1 Gestion de projet

Le projet utilise **GitHub Projects** avec un tableau Kanban lié aux issues GitHub.

**Colonnes du Kanban :**

```
Backlog → In Progress → In Review → Done
```

Chaque tâche de développement correspond à une **GitHub Issue** liée à une **Pull Request**.

---

## 16.2 Convention de nommage

### Branches

```
feature/nom-de-la-feature
fix/description-du-bug
chore/tache-technique
docs/mise-a-jour-documentation
```

### Commits

Convention **Conventional Commits** :

```
feat: ajout endpoint création commande
fix: correction validation signature webhook Stripe
chore: mise à jour dépendances Spring Boot
docs: mise à jour diagramme authentification
test: ajout tests unitaires OrderService
```

---

## 16.3 GitHub Actions (CI)

Le pipeline CI est déclenché automatiquement à chaque **push** sur les branches `main` et `develop`, ainsi qu'à chaque **Pull Request**.

### Pipeline backend (Spring Boot)

```yaml
# .github/workflows/backend-ci.yml

Déclencheurs : push main/develop, pull_request

Jobs :
  - build      : compilation Maven + vérification dépendances
  - test        : exécution des tests unitaires JUnit 5
  - lint        : vérification style de code (Checkstyle)
```

### Pipeline mobile (React Native / Expo)

```yaml
# .github/workflows/mobile-ci.yml

Déclencheurs : push main/develop, pull_request

Jobs :
  - install    : npm install
  - lint        : ESLint + TypeScript check
  - build-check : vérification que le build Expo ne produit pas d'erreur
```

> **Statut actuel** : la configuration de base des workflows est en place.
> Les jobs sont en cours de finalisation (configuration des secrets, optimisation du cache Maven/npm).

---

## 16.4 Environnements & secrets

Les variables sensibles ne sont **jamais committées** dans le dépôt.

Gestion via :

- **`.env` local** (non versionné, listé dans `.gitignore`)
- **GitHub Secrets** pour les variables utilisées dans les GitHub Actions

**Variables d'environnement principales :**

```env
# Backend
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
DATABASE_URL=

# Mobile
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
```

# 17. Décisions techniques & contraintes connues

Cette section documente les choix délibérés effectués dans le cadre du MVP.

| Sujet | Décision MVP | Justification |
|---|---|---|
| Authentification | Google OAuth2 uniquement | Réduction de complexité — pas de gestion mot de passe |
| Expiration JWT | Reconnexion forcée | Pas de refresh token dans le MVP — comportement documenté et assumé |
| Panier | Stockage local (AsyncStorage) uniquement | Simplifie l'architecture — synchronisation uniquement à la commande |
| Module Cart backend | Non implémenté en MVP | Panier 100% côté mobile — évolution possible post-MVP |
| Images produits | Volume Docker local | Suffisant pour un contexte portfolio — Cloudinary/S3 en évolution |
| Tests mobile | Hors périmètre MVP | Ajout prévu dans une phase ultérieure |
| Déploiement | Local uniquement (Docker Compose) | AWS/Render prévu en évolution post-MVP |