# FurniGo — Spécification Fonctionnelle

---

# 1. Contexte du projet

FurniGo est une application mobile e-commerce permettant la vente de mobilier.

L’application simule une expérience d’achat complète incluant :
- navigation dans un catalogue produit
- gestion d’un panier
- création de commandes
- paiement en ligne simulé
- gestion des comptes utilisateurs

L’objectif est de reproduire une expérience e-commerce réaliste dans un contexte mobile.

---

# 2. Objectifs fonctionnels

L’application doit permettre à un utilisateur de :

- créer et gérer un compte utilisateur
- consulter un catalogue de produits
- ajouter des produits à un panier
- passer une commande
- effectuer un paiement simulé
- consulter son historique de commandes
- gérer ses données personnelles (RGPD)

---

# 3. Gestion des utilisateurs

## 3.1 Création de compte
L’utilisateur doit pouvoir créer un compte via :
- authentification Google

Lors de la création :
- un profil utilisateur est créé automatiquement
- les informations de base sont récupérées depuis le fournisseur d’identité

---

## 3.2 Connexion
L’utilisateur doit pouvoir se connecter via Google.

Après connexion :
- l’utilisateur accède à son espace personnel
- ses données sont récupérées automatiquement

---

## 3.3 Déconnexion
L’utilisateur doit pouvoir se déconnecter de l’application.

---

## 3.4 Gestion du profil
L’utilisateur doit pouvoir :
- consulter ses informations personnelles
- consulter ses commandes passées

---

## 3.5 Suppression du compte (RGPD)
L’utilisateur doit pouvoir supprimer son compte.

Conséquences :
- suppression de ses données personnelles
- suppression ou anonymisation des données liées aux commandes

---

# 4. Catalogue produits

## 4.1 Consultation des produits
L’utilisateur doit pouvoir consulter une liste de produits.

Chaque produit contient :
- un nom
- une description
- un prix
- une ou plusieurs images

---

## 4.2 Détail produit
L’utilisateur doit pouvoir accéder à une fiche produit détaillée contenant :
- informations complètes du produit
- images
- prix
- possibilité d’ajout au panier

---

## 4.3 Recherche (optionnelle)
L’utilisateur peut rechercher un produit par :
- nom
- catégorie (si applicable)

---

# 5. Panier

## 5.1 Ajout au panier
L’utilisateur doit pouvoir ajouter un produit au panier depuis la fiche produit.

---

## 5.2 Gestion du panier
L’utilisateur doit pouvoir :
- modifier la quantité d’un produit
- supprimer un produit du panier
- visualiser le contenu du panier

---

## 5.3 Calcul du total
Le système doit afficher :
- le total des articles du panier
- la quantité totale

---

## 5.4 Persistance du panier
Le panier est conservé localement sur l’appareil mobile.

---

# 6. Commandes et paiement

## 6.1 Création de commande
Une commande est créée à partir du panier validé par l’utilisateur.

Une commande contient :
- les produits sélectionnés
- les quantités
- le montant total

---

## 6.2 Paiement
L’utilisateur doit pouvoir payer sa commande via un système de paiement en ligne simulé.

---

## 6.3 Statut de commande
Une commande peut avoir les statuts suivants :
- en attente de paiement
- payé
- échoué

---

## 6.4 Confirmation de commande
Une fois le paiement validé :
- la commande est confirmée
- l’utilisateur est notifié du succès du paiement

---

## 6.5 Historique des commandes
L’utilisateur doit pouvoir consulter :
- ses commandes passées
- le détail de chaque commande
- leur statut

---

# 7. RGPD et gestion des données

L’application doit respecter les principes de protection des données personnelles.

## 7.1 Export des données
L’utilisateur doit pouvoir exporter ses données personnelles dans un format structuré.

---

## 7.2 Suppression des données
L’utilisateur doit pouvoir demander la suppression complète de ses données.

---

## 7.3 Types de données

Le système distingue 3 niveaux de données :

- **Données utilisateur** : identité, profil
- **Données pseudonymisées** : données liées aux paiements et commandes
- **Données anonymisées** : données conservées à des fins statistiques

---

## 7.4 Droit à l’oubli
Le système doit permettre la suppression ou anonymisation des données sur demande utilisateur.

---

# 8. Parcours utilisateur principal

## 8.1 Parcours standard

1. Connexion via Google
2. Accès au catalogue produits
3. Consultation d’un produit
4. Ajout au panier
5. Validation du panier
6. Paiement de la commande
7. Confirmation de commande
8. Consultation de l’historique

---

## 8.2 Parcours RGPD

1. Accès aux paramètres du compte
2. Export des données OU suppression du compte
3. Confirmation de l’action

---

# 9. Règles métier

- Un utilisateur ne peut accéder à ses données qu’après authentification
- Une commande est liée à un utilisateur unique
- Une commande validée ne peut pas être modifiée
- Le panier est indépendant des commandes tant qu’il n’est pas validé
- Le prix des produits est figé au moment de la commande

---

# 10. Périmètre fonctionnel (MVP)

## Inclus :
- authentification Google
- catalogue produits
- panier
- commande
- paiement simulé
- RGPD basique (export + suppression)

## Hors périmètre initial :
- livraison réelle
- stock en temps réel
- multi-vendeur marketplace
- système de promo / coupon

---

# 11. Évolutions possibles

- système de recommandations produits
- wishlist
- notifications push
- dashboard administrateur
- système de livraison simulé
- suivi de commande avancé