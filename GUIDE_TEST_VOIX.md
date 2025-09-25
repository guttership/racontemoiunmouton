# 🎭 Guide de Test - Système de Voix Intelligent

## Nouveautés Implémentées

### 1. 🧹 Nettoyage Automatique du Texte
- **Supprime automatiquement :**
  - Les astérisques `*action*` et leur contenu
  - Les guillemets `"` `'` `«` `»` 
  - Les annotations `[note]` et `(commentaire)`
  - Les caractères markdown `*` `_` `#` `` ` `` `~`
  - Les caractères spéciaux problématiques `§©®™±×÷`
  - Les espaces multiples

### 2. 🤖 Analyse Automatique du Ton
- **L'IA Gemini analyse automatiquement l'histoire** pour détecter :
  - **Drôle** (`funny`) : histoires comiques, blagues, rires
  - **Mystérieux** (`mysterious`) : secrets, mystères, intrigues
  - **Aventureux** (`adventurous`) : quêtes, héros, courage
  - **Magique** (`magical`) : magie, fées, sortilèges
  - **Un peu effrayant** (`scary_light`) : suspense adapté aux enfants
  - **Ludique** (`playful`) : jeux, amusement, joie
  - **Doux** (`gentle`) : pour l'heure du coucher
  - Et autres tons...

### 3. 🎵 Styles de Voix Étendus
- **10 styles** au lieu de 5
- **SSML avancé** pour chaque style avec :
  - Vitesse adaptée
  - Ton (grave/aigu) selon l'émotion
  - Pauses intelligentes
  - Emphases contextuelles

## Comment Tester

### Test 1 : Génération d'Histoire Complète
1. Allez sur `http://localhost:3000`
2. Créez une histoire (ex: "un chat magique qui fait des blagues")
3. Dans l'écran de lecture, laissez "🤖 Analyse automatique" sélectionné
4. Cliquez sur "▶️ Écouter l'histoire"
5. **Résultat attendu :** L'IA devrait détecter le ton "magique" ou "drôle" et adapter la voix

### Test 2 : Comparaison des Styles
1. Allez sur `http://localhost:3000/test-tts`
2. Testez le même texte avec différents styles
3. **Observez** les différences de ton, vitesse, et expressivité

### Test 3 : Nettoyage de Texte
1. Testez avec `http://localhost:3000/api/test-clean-text` (POST)
2. Envoyez un texte avec : 
   ```
   *Il sourit* et dit "Bonjour !" [annotation] (commentaire)
   ```
3. **Résultat attendu :** "Il sourit et dit Bonjour !"

### Test 4 : Styles Spécifiques
Testez ces exemples avec analyse automatique :

**Histoire Drôle :**
"Le petit cochon était tellement rigolo qu'il faisait rire tous les animaux de la ferme. Haha ! Il faisait des blagues toute la journée !"

**Histoire Mystérieuse :**
"Dans le château sombre, un secret était caché... Que se passait-il derrière cette porte étrange ? Le mystère était total..."

**Histoire Magique :**
"La fée agita sa baguette magique et un sortilège merveilleux illumina toute la forêt enchantée..."

## Vérifications

- ✅ Aucun astérisque ou guillemet lu à voix haute
- ✅ Ton adapté automatiquement au contenu
- ✅ Vitesse et pitch ajustés selon l'émotion
- ✅ Pauses intelligentes pour le suspense/humour
- ✅ Interface claire avec description du style choisi

## Problèmes Potentiels

Si l'analyse automatique échoue :
- Fallback vers analyse par mots-clés
- Fallback final vers "Conteur traditionnel"
- Logs dans la console pour déboguer

Profitez du nouveau système intelligent ! 🎉