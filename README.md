
#  FurniGo — Mobile E-Commerce App


![Status](https://img.shields.io/badge/status-en%20d%C3%A9veloppement-blue)
![Backend](https://img.shields.io/badge/backend-Spring%20Boot-green)
![Mobile](https://img.shields.io/badge/mobile-React%20Native-orange)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![Payments](https://img.shields.io/badge/payments-Stripe-purple)
![Auth](https://img.shields.io/badge/auth-OAuth2-red)

---

## Contexte du projet

FurniGo est une application mobile e-commerce simulant une plateforme moderne de vente de mobilier.

Ce projet a été conçu dans une logique de **portfolio technique avancé**, avec un accent fort sur :
- la conception backend avec Spring Boot
- la gestion sécurisée des utilisateurs (OAuth2 + JWT)
- l’intégration d’un système de paiement Stripe en mode sandbox
- la conformité aux bonnes pratiques RGPD

---

# Objectifs

## Objectif principal
Démontrer la capacité à concevoir et développer une application fullstack mobile complète, incluant :
- une API backend robuste et sécurisée
- une application mobile fonctionnelle
- une intégration de paiement réaliste
- une gestion des données conforme RGPD

---

## Objectifs techniques
- Architecture backend modulaire (Spring Boot)
- Authentification via Google OAuth2
- Gestion des utilisateurs et des commandes
- Intégration Stripe Checkout (sandbox)
- Modélisation PostgreSQL relationnelle
- Gestion des données RGPD (export, suppression, anonymisation)

---

# Présentation

> FurniGo est une application mobile e-commerce dédiée à la vente de mobilier moderne, permettant aux utilisateurs de parcourir un catalogue de produits, gérer un panier et effectuer des paiements sécurisés via Stripe dans un environnement simulé.

> FurniGo est un projet fullstack démonstratif conçu pour mettre en avant mes compétences en développement backend Spring Boot, en architecture API sécurisée, en gestion des données sensibles (RGPD) et en intégration de paiements Stripe dans une application mobile React Native.

---

# Stack technique

## Frontend mobile
- React Native (Expo)
- Zustand (state management)
- AsyncStorage (persistance locale)
- React Navigation

## Backend
- Spring Boot (monolithe modulaire)
- Spring Security + OAuth2 (Google)
- JWT Authentication
- REST API

## Base de données
- PostgreSQL
- JPA / Hibernate

## Paiement
- Stripe Checkout (mode sandbox)
- Webhooks pour confirmation de paiement

## Infrastructure
- Docker (backend + database)
- Docker Compose

---

# Architecture globale

```text
Mobile App (React Native)
        ↓
Spring Boot API (Modulaire)
        ↓
PostgreSQL Database
        ↓
Stripe API (Payment Sandbox)
````

---

# Fonctionnalités principales

## Utilisateurs

* Connexion via Google OAuth2
* Création automatique de compte
* Gestion du profil utilisateur
* Suppression de compte (RGPD)

---

## Produits

* Catalogue de meubles
* Détails produit
* Affichage images et prix

---

## Panier

* Ajout / suppression de produits
* Gestion des quantités
* Calcul total en temps réel
* Stockage local sur mobile

---

## Commandes & paiement

* Création de commande
* Paiement Stripe (sandbox)
* Webhook de confirmation
* Mise à jour du statut de commande

---

## RGPD

* Export des données utilisateur (JSON)
* Suppression complète des données
* Anonymisation des données sensibles (commandes, paiements)

---

# Architecture backend

Le backend est structuré en modules :

* Auth
* User
* Product
* Cart
* Order
* Payment
* Common (config, errors, utils)

---

# Modèle de données (simplifié)

* User
* Product
* Cart (local côté mobile)
* Order
* OrderItem
* Payment

---

# Statut du projet

* ✔ Backend : en cours de développement
* ✔ Mobile : en conception
* ✔ Stripe : intégré en mode sandbox
* ✔ RGPD : conçu dès l’architecture

---

# Axes d’amélioration

* Ajout d’un dashboard administrateur
* Système de recommandation produits
* Notifications push (commandes)
* Mode offline avancé
* Déploiement cloud (AWS / Render)
* Ajout analytics utilisateur anonymisées

---

# Résultat attendu

À la fin du projet, FurniGo permettra de démontrer :

* une architecture backend propre et sécurisée
* une application mobile complète fonctionnelle
* une intégration Stripe réaliste
* une gestion des données conforme RGPD
* une capacité à concevoir un produit fullstack structuré

---

#  Auteur

Donovan Chartrain Développeur Web Full-Stack

🔗 GitHub : https://github.com/donovan-dev-web

