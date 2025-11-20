# Configuration Stripe pour le système Premium

## 🎯 Objectif
Configurer Stripe pour activer les abonnements Premium (2,99€/mois ou 30€/an) avec limitation freemium (1 histoire tous les 5 jours).

---

## 📋 Étapes de configuration

### 1️⃣ Créer/Connecter un compte Stripe

1. Allez sur **https://dashboard.stripe.com**
2. Créez un compte ou connectez-vous
3. **Activez le mode Test** (toggle en haut à droite du dashboard)

---

### 2️⃣ Créer les produits Premium

#### Produit 1 : Premium Mensuel

1. Dans le dashboard, allez dans **Produits** → **Ajouter un produit**
2. Remplissez :
   - **Nom** : `Premium Mensuel - Histoires Illimitées`
   - **Description** : `Accès illimité aux histoires personnalisées pour enfants`
   - **Modèle de tarification** : `Prix standard`
   - **Prix** : `2,99` **EUR**
   - **Fréquence de facturation** : `Mensuel`
   - Type : **Récurrent**
3. Cliquez sur **Enregistrer le produit**
4. **📋 COPIEZ le Price ID** (format: `price_xxxxxxxxxxxxx`)

#### Produit 2 : Premium Annuel

1. Cliquez sur **Ajouter un produit**
2. Remplissez :
   - **Nom** : `Premium Annuel - Histoires Illimitées`
   - **Description** : `Accès illimité pour 1 an (économisez 16%)`
   - **Modèle de tarification** : `Prix standard`
   - **Prix** : `30,00` **EUR**
   - **Fréquence de facturation** : `Annuel`
   - Type : **Récurrent**
3. Cliquez sur **Enregistrer le produit**
4. **📋 COPIEZ le Price ID** (format: `price_xxxxxxxxxxxxx`)

---

### 3️⃣ Récupérer les clés API

1. Allez dans **Développeurs** → **Clés API**
2. **Mode Test activé** (vérifiez le toggle)
3. Copiez :
   - **Clé publiable** : `pk_test_xxxxxxxxxxxxx`
   - **Clé secrète** : `sk_test_xxxxxxxxxxxxx` (cliquez sur "Révéler la clé de test")

---

### 4️⃣ Configurer le Webhook

#### En développement local avec Stripe CLI (recommandé)

1. **Installez Stripe CLI** :
   - Windows : `choco install stripe`
   - macOS : `brew install stripe/stripe-cli/stripe`
   - Ou téléchargez sur https://stripe.com/docs/stripe-cli

2. **Authentifiez-vous** :
   ```bash
   stripe login
   ```

3. **Transférez les webhooks vers votre serveur local** :
   ```bash
   stripe listen --forward-to localhost:3001/api/stripe/webhook
   ```
   
4. **📋 COPIEZ le signing secret** affiché (format: `whsec_xxxxxxxxxxxxx`)

#### En production (Vercel/autre)

1. Allez dans **Développeurs** → **Webhooks**
2. Cliquez sur **Ajouter un point de terminaison**
3. **URL** : `https://racontemoiunmouton.fr/api/stripe/webhook`
4. **Sélectionnez les événements** :
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
5. Cliquez sur **Ajouter un point de terminaison**
6. **📋 COPIEZ le Secret de signature** (format: `whsec_xxxxxxxxxxxxx`)

---

### 5️⃣ Mettre à jour `.env.local`

Remplacez les valeurs dans votre fichier `.env.local` :

```bash
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxx"

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY="price_xxxxxxxxxxxxx"  # Premium Mensuel 2.99€
NEXT_PUBLIC_STRIPE_PRICE_YEARLY="price_xxxxxxxxxxxxx"   # Premium Annuel 30€
```

**⚠️ REDÉMARREZ le serveur Next.js après modification** :
```bash
npm run dev
```

---

## 🧪 Tester le système Premium

### Test 1 : Limitation freemium (utilisateur gratuit)

1. Connectez-vous avec Google ou créez un compte
2. Générez une première histoire → ✅ Devrait fonctionner
3. Essayez de générer une 2e histoire immédiatement → ❌ Devrait afficher le PremiumBanner
4. Message attendu : "Vous avez atteint la limite gratuite (1 histoire tous les 5 jours)"

### Test 2 : Upgrade Premium

1. Cliquez sur **"Devenir Premium"** dans le PremiumBanner
2. Choisissez **Mensuel (2,99€)** ou **Annuel (30€)**
3. Vous serez redirigé vers Stripe Checkout
4. Utilisez la **carte de test** :
   - Numéro : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres
5. Validez le paiement
6. Vous serez redirigé vers l'application
7. **Vérifiez** :
   - Badge "Premium" visible dans le header
   - Génération d'histoires illimitée

### Test 3 : Webhook et base de données

Vérifiez que le webhook a bien mis à jour la base de données :

```bash
# Connectez-vous à Prisma Studio
npx prisma studio
```

Dans la table `User`, vérifiez :
- ✅ `isPremium` = `true`
- ✅ `stripeCustomerId` = `cus_xxxxx`
- ✅ `stripeSubscriptionId` = `sub_xxxxx`
- ✅ `premiumSince` = date actuelle

### Test 4 : Annulation d'abonnement

1. Allez dans le dashboard Stripe
2. **Clients** → trouvez votre compte test
3. **Abonnements** → **Annuler l'abonnement**
4. Le webhook devrait mettre `isPremium = false`
5. Vérifiez que la limitation gratuite est à nouveau active

---

## 🔍 Débogage

### Problème : Le webhook ne fonctionne pas

**Vérifiez que Stripe CLI est actif** :
```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

**Consultez les logs du webhook** dans le terminal où tourne Stripe CLI

**Testez manuellement le webhook** :
```bash
stripe trigger checkout.session.completed
```

### Problème : Redirection après paiement ne fonctionne pas

Vérifiez dans `src/app/api/stripe/checkout/route.ts` :
- `success_url` pointe vers `${NEXTAUTH_URL}/?premium=success`
- `cancel_url` pointe vers `${NEXTAUTH_URL}/premium?canceled=true`

### Problème : isPremium ne se met pas à jour

1. Vérifiez les logs du serveur Next.js
2. Vérifiez que le webhook reçoit bien l'événement `checkout.session.completed`
3. Vérifiez la connexion à la base de données (Neon peut mettre en pause les connexions inactives)

---

## 📊 Données de test Stripe

**Cartes de test** :
- ✅ Succès : `4242 4242 4242 4242`
- ❌ Décliné : `4000 0000 0000 0002`
- 🔐 3D Secure : `4000 0027 6000 3184`

**Autres détails** :
- Date : n'importe quelle date future (ex: 12/30)
- CVC : n'importe quel 3 chiffres (ex: 123)
- Code postal : n'importe lequel (ex: 75001)

---

## ✅ Checklist de configuration

- [ ] Compte Stripe créé et mode Test activé
- [ ] Produit "Premium Mensuel" créé (2,99€/mois)
- [ ] Produit "Premium Annuel" créé (30€/an)
- [ ] Price IDs copiés et ajoutés dans `.env.local`
- [ ] Clés API copiées et ajoutées dans `.env.local`
- [ ] Webhook configuré (Stripe CLI en dev ou URL en prod)
- [ ] Webhook secret copié et ajouté dans `.env.local`
- [ ] Serveur Next.js redémarré
- [ ] Test de paiement effectué avec carte test
- [ ] Badge Premium visible après paiement
- [ ] Génération illimitée fonctionne

---

## 🚀 Passage en production

Quand vous êtes prêt à déployer :

1. **Désactivez le mode Test** dans Stripe
2. Créez les mêmes produits en **mode Live**
3. Récupérez les nouvelles clés API **Live** (`pk_live_...` et `sk_live_...`)
4. Configurez un nouveau webhook avec l'URL de production
5. Mettez à jour les variables d'environnement sur Vercel :
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`
   - `NEXT_PUBLIC_STRIPE_PRICE_YEARLY`

---

## 📞 Support

- **Documentation Stripe** : https://stripe.com/docs
- **Dashboard Stripe** : https://dashboard.stripe.com
- **Stripe CLI** : https://stripe.com/docs/stripe-cli
- **Cartes de test** : https://stripe.com/docs/testing
