# 🐑 Raconte-moi un mouton

Une application Next.js pour créer des histoires personnalisées pour le coucher des enfants, utilisant l'intelligence artificielle Google Gemini.

## ✨ Fonctionnalités

- **🎭 Sélection de personnages** : Choisissez parmi animaux, fées, dragons, super-héros, etc.
- **🌍 Environnements variés** : Forêt enchantée, château magique, vaisseau spatial, etc.
- **👶 Personnalisation enfant** : Intégrez le nom, l'âge, les centres d'intérêt et la personnalité
- **🎤 Synthèse vocale** : Lecture automatique de l'histoire en français
- **📱 Design responsive** : Interface optimisée mobile-first pour une utilisation sur smartphone
- **🎨 Interface moderne** : Design élégant avec DaisyUI et Tailwind CSS

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd racontemoiunmouton
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'API Gemini**
   - Copiez `.env.example` vers `.env.local`
   - Ajoutez votre clé API Google Gemini :
   ```
   GOOGLE_AI_API_KEY=votre_cle_api_google_gemini
   ```

4. **Lancer en développement**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 🛠️ Technologies utilisées

- **Next.js 15+** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utility-first
- **DaisyUI** - Composants Tailwind pré-stylés
- **Google Gemini AI** - Génération d'histoires intelligentes
- **Vercel** - Plateforme de déploiement

## 📱 Utilisation

1. **Sélectionnez les personnages** de votre histoire
2. **Choisissez le nombre** de personnages (1-5)
3. **Définissez l'environnement** où se déroule l'histoire
4. **Personnalisez pour votre enfant** (optionnel) :
   - Nom et âge
   - Centres d'intérêt (animaux, musique, sport...)
   - Traits de personnalité (curieux, courageux...)
   - Choses préférées (doudou, activités...)
5. **Générez l'histoire** et profitez !
6. **Utilisez la synthèse vocale** pour une lecture automatique

## 🎯 Optimisations

- **Mobile-first** : Interface pensée pour smartphones
- **Performance** : Chargement optimisé avec Next.js
- **Accessibilité** : Navigation au clavier et lecteurs d'écran
- **Responsive** : S'adapte à toutes les tailles d'écran

## 🔧 Déploiement sur Vercel

1. **Connectez votre repo GitHub à Vercel**
2. **Configurez les variables d'environnement** :
   - `GOOGLE_AI_API_KEY`
3. **Déployez automatiquement** à chaque push

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Ajouter des personnages ou environnements

## 📄 Licence

Ce projet est sous licence MIT.

---

Créé avec ❤️ pour des moments magiques avant le coucher !
