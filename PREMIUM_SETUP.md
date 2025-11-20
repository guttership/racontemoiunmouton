# 🔒 Configuration Premium - Raconte-moi un mouton

## ✅ Infrastructure Backend (COMPLÉTÉE)

### 1. Base de données Prisma ✅
- **Fichier** : `prisma/schema.prisma`
- **Modèles** :
  - `User` : gestion auth + premium (isPremium, stripeCustomerId, stripeSubscriptionId, lastStoryDate, storiesGenerated)
  - `Account` / `Session` : NextAuth
  - `Story` : tracking des histoires générées
  - `VerificationToken` : vérification email

### 2. NextAuth v5 ✅
- **Fichier** : `src/auth.ts`
- **Providers** :
  - 🔑 Credentials (email/password)
  - 🔍 Google OAuth (optionnel)
- **Features** :
  - Vérification email obligatoire
  - Status `isPremium` dans la session
  - PrismaAdapter intégré

### 3. Routes API Auth ✅
- `POST /api/auth/signup` : Création compte + hash password + token vérification
- `GET /api/auth/verify-email?token=xxx` : Vérification email
- `GET|POST /api/auth/[...nextauth]` : Handlers NextAuth

### 4. Routes API Stripe ✅
- `POST /api/stripe/checkout` : Créer session de paiement (mensuel/annuel)
- `POST /api/stripe/webhook` : Webhooks Stripe (checkout.session.completed, subscription.updated/deleted)
- `POST /api/stripe/cancel-subscription` : Annuler abonnement

### 5. Système de limitation freemium ✅
- **Fichier** : `src/lib/story-limit.ts`
- **Fonctions** :
  - `checkStoryLimit(userId)` : Vérifie si l'utilisateur peut générer une histoire
  - `updateLastStoryDate(userId)` : Met à jour après génération
  - `saveStory(...)` : Sauvegarde dans DB + update lastStoryDate
  - `getUserStories(userId)` : Récupère l'historique

**Règles** :
- ✅ **Premium** → Illimité
- 🆓 **Gratuit** → 1 histoire tous les 5 jours

---

## 🎨 Frontend à implémenter

### 6. Composants d'authentification 🔲
**À créer** :
- `src/components/auth/SignInForm.tsx` : Formulaire de connexion
- `src/components/auth/SignUpForm.tsx` : Formulaire d'inscription
- `src/app/[locale]/auth/signin/page.tsx` : Page de connexion
- `src/app/[locale]/auth/signup/page.tsx` : Page d'inscription

**Fonctionnalités** :
- Connexion email/password
- Connexion OAuth Google
- Gestion des erreurs (EMAIL_NOT_VERIFIED, etc.)
- Redirection après connexion

### 7. Composant PremiumBanner 🔲
**À créer** : `src/components/PremiumBanner.tsx`

**Affichage** :
- Badge "Premium" si isPremium = true
- Sinon : "🆓 1 histoire tous les 5 jours - Upgrade pour illimité"
- Pricing : 2,99€/mois ou 30€/an
- Bouton "Devenir Premium"

**Logique** :
- Si non connecté → redirect `/auth/signin?returnUrl=/premium`
- Si connecté → appel `/api/stripe/checkout` avec priceId
- Gestion du retour après paiement (sessionStorage + URL params)

### 8. Intégration dans StoryGenerator 🔲
**Fichiers à modifier** :
- `src/app/[locale]/page.tsx` ou composant de génération

**Modifications** :
```typescript
import { checkStoryLimit, saveStory } from '@/lib/story-limit';

// Avant génération
const limitCheck = await checkStoryLimit(session.user.id);
if (!limitCheck.canGenerate) {
  // Afficher message avec lien vers /premium
  return { error: 'LIMIT_REACHED', daysUntilNext: limitCheck.daysUntilNext };
}

// Après génération
await saveStory({
  userId: session.user.id,
  characters: JSON.stringify(selectedCharacters),
  setting,
  number,
  locale,
  content: generatedStory,
  audioUrl: audioFileUrl,
});
```

### 9. Page Pricing/Premium 🔲
**À créer** : `src/app/[locale]/premium/page.tsx`

**Contenu** :
- Comparatif Gratuit vs Premium
- **Gratuit** :
  - 1 histoire / 5 jours
  - Tous les personnages
  - Tous les environnements
- **Premium** :
  - ✅ Histoires illimitées
  - ✅ Accès anticipé aux nouvelles fonctionnalités
  - ✅ Support prioritaire
- Boutons d'achat : Mensuel (2,99€) / Annuel (30€)
- **Traductions** : FR, EN, ES, DE

### 10. Traductions 🔲
**Fichiers à modifier** : `messages/{fr,en,es,de}.json`

**Namespaces à ajouter** :
```json
{
  "Auth": {
    "signIn": "Se connecter",
    "signUp": "Créer un compte",
    "email": "Email",
    "password": "Mot de passe",
    "forgotPassword": "Mot de passe oublié ?",
    "noAccount": "Pas encore de compte ?",
    "alreadyAccount": "Déjà un compte ?",
    "verifyEmail": "Vérifie ton email",
    "emailNotVerified": "Email non vérifié"
  },
  "Premium": {
    "title": "Devenir Premium",
    "freePlan": "Gratuit",
    "premiumPlan": "Premium",
    "monthly": "Mensuel",
    "yearly": "Annuel",
    "perMonth": "/mois",
    "perYear": "/an",
    "freeFeature1": "1 histoire tous les 5 jours",
    "premiumFeature1": "Histoires illimitées",
    "upgrade": "Devenir Premium",
    "limitReached": "Tu as atteint ta limite gratuite",
    "daysUntilNext": "{days} jours avant ta prochaine histoire",
    "or": "ou"
  }
}
```

---

## ⚙️ Configuration Stripe Dashboard

### 11. Créer les produits Stripe 🔲
1. Aller sur [Stripe Dashboard](https://dashboard.stripe.com)
2. **Products** > **Add Product**

#### Produit Mensuel
- **Name** : Raconte-moi un mouton Premium - Mensuel
- **Price** : 2,99 EUR
- **Billing** : Monthly
- Copier le **Price ID** (commence par `price_...`)
- L'ajouter dans `.env.local` comme `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`

#### Produit Annuel
- **Name** : Raconte-moi un mouton Premium - Annuel
- **Price** : 30 EUR
- **Billing** : Yearly
- Copier le **Price ID**
- L'ajouter dans `.env.local` comme `NEXT_PUBLIC_STRIPE_PRICE_YEARLY`

### 12. Configurer le Webhook
1. **Developers** > **Webhooks** > **Add endpoint**
2. **URL** : `https://racontemoiunmouton.fr/api/stripe/webhook`
3. **Événements** à écouter :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copier le **Signing secret** (commence par `whsec_...`)
5. L'ajouter dans `.env.local` comme `STRIPE_WEBHOOK_SECRET`

---

## 🚀 Déploiement & Configuration

### Variables d'environnement requises
```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="https://racontemoiunmouton.fr"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY="price_..."
NEXT_PUBLIC_STRIPE_PRICE_YEARLY="price_..."
```

### Commandes Prisma
```bash
# Générer le client Prisma
npx prisma generate

# Créer la migration initiale
npx prisma migrate dev --name init

# Appliquer les migrations en production
npx prisma migrate deploy

# Ouvrir Prisma Studio (interface DB)
npx prisma studio
```

---

## 🧪 Tests

### Cartes de test Stripe
- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **CVC** : n'importe quel 3 chiffres
- **Date** : n'importe quelle date future

### Flux de test complet
1. ✅ Inscription (`POST /api/auth/signup`)
2. ✅ Vérification email (`GET /api/auth/verify-email?token=xxx`)
3. ✅ Connexion (`POST /api/auth/[...nextauth]`)
4. ✅ Génération 1ère histoire (gratuit)
5. ❌ Tentative 2ème histoire < 5 jours → bloqué
6. ✅ Upgrade Premium (`POST /api/stripe/checkout`)
7. ✅ Paiement Stripe (carte test)
8. ✅ Webhook reçu → `isPremium = true`
9. ✅ Génération illimitée
10. ✅ Annulation abonnement (`POST /api/stripe/cancel-subscription`)

---

## 📋 Checklist d'implémentation

### Backend ✅
- [x] Installer dépendances (Prisma, NextAuth, Stripe, bcryptjs)
- [x] Créer schéma Prisma
- [x] Configurer NextAuth
- [x] Routes API Auth
- [x] Routes API Stripe
- [x] Système de limitation
- [x] Variables d'environnement

### Frontend 🔲
- [ ] Composants auth (SignIn/SignUp)
- [ ] Composant PremiumBanner
- [ ] Intégration dans StoryGenerator
- [ ] Page Pricing/Premium
- [ ] Traductions (FR/EN/ES/DE)

### Configuration 🔲
- [ ] Créer produits Stripe
- [ ] Configurer webhook Stripe
- [ ] Setup base de données PostgreSQL
- [ ] Configurer Google OAuth (optionnel)

### Tests 🔲
- [ ] Test inscription + vérification
- [ ] Test limitation freemium
- [ ] Test paiement Stripe
- [ ] Test webhook
- [ ] Test annulation abonnement

---

## 📚 Prochaines étapes

1. **Créer les composants UI auth** (SignInForm, SignUpForm, pages)
2. **Créer le PremiumBanner** (inspiré de pfffme)
3. **Intégrer checkStoryLimit()** dans le flow de génération
4. **Créer la page /premium** avec pricing
5. **Ajouter les traductions** dans messages/
6. **Tester en local** avec Stripe CLI
7. **Déployer sur Vercel** avec les variables d'environnement
8. **Configurer Stripe en production**
