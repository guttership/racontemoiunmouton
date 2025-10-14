# Configuration des voix Text-to-Speech multilingues

## Vue d'ensemble

L'application utilise Google Cloud Text-to-Speech avec des voix optimisées pour chaque langue.

## Voix configurées par langue

### 🇫🇷 Français (FR)
- **Féminine**: `fr-FR-Wavenet-C` (Sophie) - Voix chaleureuse et apaisante
- **Masculine**: `fr-FR-Wavenet-D` (Thomas) - Voix expressive et douce

### 🇬🇧 Anglais (EN)
- **Féminine**: `en-US-Wavenet-C` - Voix Wavenet féminine naturelle
- **Masculine**: `en-US-Wavenet-D` - Voix Wavenet masculine naturelle
- **Note**: Wavenet offre une qualité supérieure avec deep learning

### 🇪🇸 Espagnol (ES)
- **Féminine**: `es-ES-Wavenet-C` - Voix Wavenet espagnole féminine
- **Masculine**: `es-ES-Wavenet-B` - Voix Wavenet espagnole masculine
- **Note**: Wavenet avec accent espagnol natif

### 🇩🇪 Allemand (DE)
- **Féminine**: `de-DE-Wavenet-C` - Voix Wavenet allemande féminine
- **Masculine**: `de-DE-Wavenet-D` - Voix Wavenet allemande masculine
- **Note**: Wavenet avec accent allemand natif

## Paramètres audio

### Paramètres par défaut
```javascript
{
  speed: 0.75,        // Vitesse réduite de 25% pour un rythme apaisant
  pitch: 0.0,         // Ton neutre
  volumeGainDb: -0.5, // Volume légèrement réduit
  autoAnalyze: true   // L'IA adapte le ton selon le contenu
}
```

### Adaptation selon l'âge
- **0-3 ans**: Voix très douce, rythme lent
- **4-6 ans**: Voix animée, rythme modéré
- **7-12 ans**: Voix expressive, rythme normal
- **13+ ans**: Voix mature, style narratif

## Preprocessing SSML par langue

### Français
- Gestion des élisions: `l'enfant` → optimisé pour TTS
- Liaison automatique des mots

### Anglais
- Normalisation des contractions: `don't`, `won't`, `I'm`
- Gestion des apostrophes

### Espagnol et Allemand
- Pas de preprocessing spécifique
- Texte utilisé tel quel

## Types de voix Google Cloud

### Wavenet (Premium)
- Qualité supérieure avec deep learning
- Voix naturelles et expressives
- Utilisé pour le français

### Journey (Premium)
- Voix conversationnelles avancées
- Meilleure expression émotionnelle
- Utilisé pour l'anglais

### Polyglot (Premium)
- Voix multilingues avec accent neutre
- Optimisé pour plusieurs langues
- Utilisé pour l'espagnol et l'allemand

## Fichiers impliqués

### Configuration des voix
- `src/components/StoryReader.tsx` - Configuration `VOICE_CONFIG`

### API TTS
- `src/app/api/text-to-speech/route.ts` - Traitement et génération audio
- `src/lib/googleStoryTeller.ts` - Client Google TTS

### Génération d'histoires
- `src/lib/gemini.ts` - Génération avec prompts multilingues
- `src/lib/story-prompts.ts` - Prompts par langue

## Coûts estimés

**Wavenet/Journey/Polyglot**: ~$16 par million de caractères

Pour une histoire moyenne de 1000 caractères:
- 1 histoire = $0.016
- 100 histoires = $1.60
- 1000 histoires = $16.00

## Alternatives possibles

Si besoin de réduire les coûts:

### Standard voices (gratuit)
```javascript
'fr': { female: 'fr-FR-Standard-C', male: 'fr-FR-Standard-D' }
'en': { female: 'en-US-Standard-C', male: 'en-US-Standard-D' }
'es': { female: 'es-ES-Standard-A', male: 'es-ES-Standard-B' }
'de': { female: 'de-DE-Standard-A', male: 'de-DE-Standard-B' }
```

### Neural2 voices (prix moyen)
```javascript
'fr': { female: 'fr-FR-Neural2-A', male: 'fr-FR-Neural2-B' }
'en': { female: 'en-US-Neural2-C', male: 'en-US-Neural2-D' }
'es': { female: 'es-ES-Neural2-A', male: 'es-ES-Neural2-B' }
'de': { female: 'de-DE-Neural2-A', male: 'de-DE-Neural2-B' }
```

## Ressources

- [Google Cloud TTS Voices](https://cloud.google.com/text-to-speech/docs/voices)
- [Journey Voices](https://cloud.google.com/text-to-speech/docs/journey-voices)
- [Polyglot Voices](https://cloud.google.com/text-to-speech/docs/polyglot-voices)
- [SSML Reference](https://cloud.google.com/text-to-speech/docs/ssml)
