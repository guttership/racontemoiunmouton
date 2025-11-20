# Configuration Google OAuth

## Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ ou Google Identity

## Étape 2 : Configurer l'écran de consentement OAuth

1. Dans le menu, allez dans **APIs & Services > OAuth consent screen**
2. Choisissez **External** (sauf si vous avez Google Workspace)
3. Remplissez les informations requises :
   - Nom de l'application : "Raconte-moi un mouton"
   - Email de support utilisateur : votre email
   - Logo (optionnel)
4. Ajoutez les scopes nécessaires : `email`, `profile`
5. Sauvegardez

## Étape 3 : Créer les credentials OAuth 2.0

1. Dans le menu, allez dans **APIs & Services > Credentials**
2. Cliquez sur **+ Create Credentials**
3. Sélectionnez **OAuth 2.0 Client ID**
4. Type d'application : **Web application**
5. Nom : "Raconte-moi un mouton - Web"

### Authorized JavaScript origins

Ajoutez les URLs suivantes :
```
http://localhost:3000
http://localhost:3001
https://racontemoiunmouton.fr
https://www.racontemoiunmouton.fr
```

### Authorized redirect URIs

Ajoutez les URLs suivantes :
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
https://racontemoiunmouton.fr/api/auth/callback/google
https://www.racontemoiunmouton.fr/api/auth/callback/google
```

## Étape 4 : Copier les credentials

Après création, une fenêtre popup s'affiche avec :
- **Client ID** : `xxxxx.apps.googleusercontent.com`
- **Client Secret** : `GOCSPX-xxxxx`

Copiez ces valeurs dans votre fichier `.env.local` :

```bash
GOOGLE_CLIENT_ID="votre-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-votre-secret"
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED="true"
```

## Étape 5 : Redémarrer le serveur

Après avoir ajouté les variables, redémarrez le serveur de développement :

```bash
npm run dev
```

## Vérification

Le bouton "Continuer avec Google" devrait maintenant apparaître sur les pages de connexion et d'inscription.

## Troubleshooting

### Erreur : "redirect_uri_mismatch"
- Vérifiez que l'URL de redirection est bien configurée dans Google Cloud Console
- Assurez-vous que l'URL correspond exactement (http vs https, port, etc.)

### Le bouton Google n'apparaît pas
- Vérifiez que `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED="true"` dans `.env.local`
- Redémarrez le serveur après avoir modifié `.env.local`

### Erreur : "Access blocked: This app's request is invalid"
- Vérifiez que l'écran de consentement OAuth est bien configuré
- Assurez-vous que les scopes `email` et `profile` sont autorisés
