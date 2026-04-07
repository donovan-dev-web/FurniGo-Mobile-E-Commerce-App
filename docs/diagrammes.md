### 1. Diagramme d’architecture globale

```mermaid
flowchart TD

Mobile["React Native App (Expo)"]
API["Spring Boot API (monolithe modulaire)"]
DB[("PostgreSQL")]
Stripe["Stripe API"]

Mobile -->|HTTPS / REST + JWT| API
API --> DB
API -->|Checkout / Webhooks| Stripe
Stripe -->|Webhook payment status| API
```

---

### 2. Diagramme Authentification (OAuth2 + JWT)

```mermaid
sequenceDiagram

participant U as Utilisateur
participant M as Mobile App (Expo)
participant G as Google OAuth2
participant A as API Spring Boot

U->>M: Appuie sur "Se connecter avec Google"
M->>G: Ouverture navigateur via expo-auth-session
G->>U: Consentement utilisateur
U->>G: Accepte
G->>M: Retour id_token Google (AuthSession callback)

M->>A: POST /auth/google { id_token }
A->>G: Validation id_token (Google Token Verification)
G-->>A: Profil utilisateur (email, name, sub)

A->>A: Création ou récupération User en base
A->>M: Retour JWT applicatif

M->>M: Stockage JWT (AsyncStorage)
M->>M: Accès aux routes protégées
```

---

### 3. Flow panier → commande → paiement

```mermaid
sequenceDiagram

participant M as Mobile App
participant A as API Spring Boot
participant D as PostgreSQL
participant S as Stripe

M->>A: POST /orders (panier)
A->>D: création Order (PENDING)
D-->>A: orderId

A->>S: création Checkout Session
S-->>A: sessionUrl

A-->>M: URL Stripe Checkout

M->>S: Paiement utilisateur

S->>A: Webhook payment_success
A->>D: update Order = PAID
```

---

### 4. Modèle de données (ERD simplifié)

```mermaid
erDiagram

USER ||--o{ ORDER : places
ORDER ||--|{ ORDER_ITEM : contains
ORDER ||--|| PAYMENT : has
PRODUCT ||--o{ ORDER_ITEM : referenced

USER {
    string id
    string email
    string name
    string provider
    string providerId
}

PRODUCT {
    string id
    string name
    string description
    float price
}

ORDER {
    string id
    string status
    float totalAmount
    date createdAt
}

ORDER_ITEM {
    string id
    int quantity
    float unitPrice
}

PAYMENT {
    string id
    string stripeSessionId
    string status
}
```

---

### 5. Flow Stripe détaillé

```mermaid
sequenceDiagram

participant M as Mobile App
participant A as Backend API
participant S as Stripe
participant DB as Database

M->>A: POST /checkout-session
A->>A: création Order (PENDING)
A->>S: Create Checkout Session
S-->>A: session URL
A-->>M: URL Stripe

M->>S: paiement utilisateur

S->>A: webhook payment_intent.succeeded
A->>A: validation signature webhook
A->>DB: update Order = PAID
```

---

### 6. Flux RGPD (export / suppression)

```mermaid
sequenceDiagram

participant U as Utilisateur
participant M as Mobile App
participant A as API
participant D as DB

U->>M: Demande RGPD
M->>A: GET /user/export
A->>D: récupération données
D-->>A: données user + orders
A-->>M: JSON export

U->>M: Suppression compte
M->>A: DELETE /user
A->>D: suppression ou anonymisation
D-->>A: confirmation
A-->>M: OK
```