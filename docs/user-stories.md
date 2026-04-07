# User Stories — E-commerce Mobile App
## EPIC 1 — Authentification & utilisateurs
### US-1 — Création de compte
```
En tant qu’utilisateur, je veux pouvoir créer un compte afin d’accéder à l’application.
Critères d’acceptation :
• inscription via Google OAuth2
• utilisateur créé en base de données PostgreSQL
• retour d’un token JWT
```
### US-2 — Connexion utilisateur
```
En tant qu’utilisateur, je veux pouvoir me connecter afin d’accéder à mon espace personnel.
Critères d’acceptation :
• login Google OAuth2
• génération JWT valide
• accès aux routes protégées
```
### US-3 — Déconnexion
```
En tant qu’utilisateur, je veux pouvoir me déconnecter afin de sécuriser mon compte.
Critères d’acceptation :
• suppression du token côté client
• déconnexion est uniquement côté client (suppression du token local)
```
### US-4 — Gestion du profil
```
En tant qu’utilisateur, je veux consulter mes informations personnelles afin de les gérer.
Critères d’acceptation :
• affichage nom / email
• récupération depuis API Spring Boot
```
### US-5 — Suppression de compte (RGPD)
```
En tant qu’utilisateur, je veux supprimer mon compte afin de supprimer mes données personnelles.
Critères d’acceptation :
• suppression utilisateur en base PostgreSQL
• suppression des commandes associées (ou anonymisation)
• confirmation utilisateur obligatoire
```
---
## EPIC 2 — Catalogue produits
### US-6 — Voir les produits
```
En tant qu’utilisateur, je veux voir une liste de produits afin de choisir un article.
Critères d’acceptation :
• récupération via API Spring Boot
• affichage image + prix + nom
• pagination ou liste simple
```
### US-7 — Voir détail produit
```
En tant qu’utilisateur, je veux voir le détail d’un produit afin de mieux l’évaluer.
Critères d’acceptation :
• description complète
• prix
• images
• ajout au panier
```
### US-8 — Recherche produits (optionnel MVP+)
```
En tant qu’utilisateur, je veux rechercher un produit afin de le trouver rapidement.
```
---
## EPIC 3 — Panier
### US-9 — Ajouter au panier
```
En tant qu’utilisateur, je veux ajouter un produit à mon panier afin de l’acheter plus tard.
Critères d’acceptation :
• ajout depuis fiche produit
• mise à jour du total
```
### US-10 — Modifier panier
```
En tant qu’utilisateur, je veux modifier les quantités dans mon panier afin d’ajuster ma commande.
```
### US-11 — Supprimer du panier
```
En tant qu’utilisateur, je veux supprimer un produit de mon panier.
```
### US-12 — Voir le total
```
En tant qu’utilisateur, je veux voir le prix total de mon panier.
```
---
## EPIC 4 — Commandes & paiement
### US-13 — Créer une commande
```
En tant qu’utilisateur, je veux valider mon panier afin de créer une commande.
```
### US-14 — Paiement Stripe
```
En tant qu’utilisateur, je veux payer ma commande afin de finaliser mon achat.
Critères d’acceptation :
• redirection vers Checkout
• paiement en mode test
• retour statut paiement
```
### US-15 — Confirmation de commande
```
En tant qu’utilisateur, je veux recevoir une confirmation après paiement réussi.
```
### US-16 — Historique des commandes
```
En tant qu’utilisateur, je veux voir mes anciennes commandes.
```
---
## EPIC 5 — Sécurité & backend
### US-17 — Authentification sécurisée
```
En tant que système, je veux sécuriser les routes API afin de protéger les données.
Tech :
• Spring Security + OAuth2
• JWT
```
### US-18 — Protection des routes
```
En tant que système, je veux restreindre l’accès aux ressources utilisateur.
```
---
## EPIC 6 — RGPD & données
### US-19 — Export des données
```
En tant qu’utilisateur, je veux exporter mes données personnelles.
```
### US-20 — Suppression complète des données
```
En tant qu’utilisateur, je veux que mes données soient supprimées définitivement.
```
---
## EPIC 7 — Backend & architecture
### US-21 — API produits
```
En tant que système, je veux fournir une API pour les produits.
```
### US-22 — API commandes
```
En tant que système, je veux gérer les commandes via API.
```
### US-23 — Webhook Stripe
```
En tant que système, je veux recevoir les événements Stripe afin de mettre à jour les commandes.
```
---
## EPIC 8 — Qualité & infrastructure
### US-24 — Dockerisation backend
```
En tant que développeur, je veux containeriser le backend afin de faciliter le déploiement.
```
### US-25 — Dockerisation base de données
```
En tant que développeur, je veux containeriser PostgreSQL afin de simplifier l’environnement local.
```
---
## EPIC 9 — UX mobile
### US-26 — Navigation fluide
```
En tant qu’utilisateur, je veux naviguer facilement dans l’application.
```
### US-27 — Gestion des erreurs
```
En tant qu’utilisateur, je veux voir des messages clairs en cas d’erreur.
```