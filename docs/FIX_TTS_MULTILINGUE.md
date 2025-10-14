# Correctif TTS Multilingue

## Problème identifié

❌ **Symptôme**: Un narrateur français lisait du texte anglais au lieu d'une voix anglophone native.

## Cause racine

Le paramètre `autoAnalyze: true` dans `StoryReader.tsx` forçait l'utilisation de la fonction `generateAutoStyledSpeech()` qui:
1. Analysait le ton de l'histoire (drôle, mystérieux, etc.)
2. Sélectionnait automatiquement un style prédéfini
3. **Utilisait des voix françaises hardcodées** dans `STORY_VOICE_STYLES` (ex: `fr-FR-Wavenet-C`)
4. Ignorait complètement la voix spécifiée selon la locale

## Solution appliquée

### 1. Simplification de l'API TTS (`src/app/api/text-to-speech/route.ts`)

**Avant:**
```typescript
if (autoAnalyze) {
  buffer = await googleStoryTeller.generateAutoStyledSpeech(ssmlText);
} else if (isAdult) {
  buffer = await googleStoryTeller.generateStyledSpeech(ssmlText, 'storyteller');
} else if (style && Object.keys(STORY_VOICE_STYLES).includes(style)) {
  buffer = await googleStoryTeller.generateStyledSpeech(ssmlText, style);
} else {
  const options: GoogleTTSOptions = { voice, speed, pitch, volumeGainDb };
  buffer = await googleStoryTeller.generateSpeech(ssmlText, options, undefined, true);
}
```

**Après:**
```typescript
// Toujours utiliser la voix spécifiée (pas de style auto qui force une voix française)
const options: GoogleTTSOptions = { voice, speed, pitch, volumeGainDb };
const buffer = await googleStoryTeller.generateSpeech(ssmlText, options, undefined, true);
```

### 2. Nettoyage des paramètres inutilisés

- ❌ Supprimé: `autoAnalyze`
- ❌ Supprimé: `style`
- ❌ Supprimé: `isAdult`
- ❌ Supprimé: Import `STORY_VOICE_STYLES`

### 3. Ajout de logs de débogage (`src/components/StoryReader.tsx`)

```typescript
console.log('🌍 Locale actuelle:', locale);
console.log('🎭 Type narrateur:', narratorType);
console.log('🔊 Voix sélectionnée:', selectedVoice);
console.log('📋 Configuration voix:', voiceConfig);
```

## Résultat

✅ **Maintenant**: Chaque langue utilise correctement sa voix native:
- 🇫🇷 Français → `fr-FR-Wavenet-C/D`
- 🇬🇧 Anglais → `en-US-Journey-F/D`
- 🇪🇸 Espagnol → `es-ES-Polyglot-1`
- 🇩🇪 Allemand → `de-DE-Polyglot-1`

## Test de validation

1. **Générer une histoire en anglais** (changer la langue en EN)
2. **Cliquer sur "Listen to the story"**
3. **Vérifier la console** pour voir:
   ```
   🌍 Locale actuelle: en
   🎭 Type narrateur: female
   🔊 Voix sélectionnée: en-US-Journey-F
   ```
4. **L'audio** devrait être en anglais avec une voix anglophone native

## Fichiers modifiés

- ✅ `src/app/api/text-to-speech/route.ts` - Simplification logique TTS
- ✅ `src/components/StoryReader.tsx` - Suppression `autoAnalyze`, ajout logs
- 📝 `docs/FIX_TTS_MULTILINGUE.md` - Cette documentation

## Notes importantes

### Fonctionnalités conservées
- ✅ Sélection narrateur féminin/masculin
- ✅ Vitesse ralentie (0.75x)
- ✅ Volume réduit (-0.5 dB)
- ✅ Preprocessing SSML par langue
- ✅ Segmentation SSML < 5000 bytes

### Fonctionnalités supprimées
- ❌ Analyse automatique du ton (drôle, mystérieux, etc.)
- ❌ Styles vocaux prédéfinis
- ❌ Mode adulte automatique

**Raison**: Ces fonctionnalités utilisaient des voix françaises hardcodées, incompatibles avec le multilingue.

## Si besoin de réactiver les styles

Pour réactiver l'analyse de ton tout en respectant le multilingue, il faudrait:

1. Créer des `STORY_VOICE_STYLES` par langue:
```typescript
const VOICE_STYLES_BY_LOCALE = {
  'fr': { soft: { voice: 'fr-FR-Wavenet-C', ... }, ... },
  'en': { soft: { voice: 'en-US-Journey-F', ... }, ... },
  'es': { soft: { voice: 'es-ES-Polyglot-1', ... }, ... },
  'de': { soft: { voice: 'de-DE-Polyglot-1', ... }, ... }
}
```

2. Passer la locale à `generateAutoStyledSpeech()`
3. Sélectionner le style dans le bon ensemble de voix

**Recommandation**: Reporter cette fonctionnalité à plus tard, la correction simple fonctionne bien.
