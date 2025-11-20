# Configuration de l'API Google Cloud Speech-to-Text

## 🎯 Activation de l'API

Votre clé API Google AI (`AIzaSyDvlpEPsShwbS9oyf_NGbevuDVA-eYuiuU`) doit avoir accès à l'API Speech-to-Text.

### Étapes :

1. **Aller sur Google Cloud Console** :
   https://console.cloud.google.com/apis/library/speech.googleapis.com

2. **Activer l'API Cloud Speech-to-Text** :
   - Cliquez sur "Activer"
   - Vérifiez que le projet est bien sélectionné

3. **Vérifier les quotas** :
   - Gratuit : 60 minutes de transcription/mois
   - Au-delà : ~0.006$/15 secondes

## ✅ Aucune installation npm requise

L'implémentation utilise directement l'API REST de Google Cloud Speech-to-Text via `fetch()`, donc **pas besoin d'installer** `@google-cloud/speech`.

## 🔑 Variables d'environnement

Déjà configurées dans `.env.local` :
```
GOOGLE_AI_API_KEY=AIzaSyDvlpEPsShwbS9oyf_NGbevuDVA-eYuiuU
```

## 🎤 Comment ça fonctionne

1. **Client (VoiceInputRecorder.tsx)** :
   - Capture l'audio via `MediaRecorder`
   - Convertit en base64
   - Envoie à l'action serveur

2. **Serveur (transcribeAudio.server.ts)** :
   - Appelle l'API Google Cloud Speech-to-Text
   - Supporte : WEBM_OPUS, OGG_OPUS (fallback automatique)
   - Retourne le texte transcrit

3. **Langues supportées** :
   - `fr-FR` (Français)
   - `en-US` (Anglais)
   - `es-ES` (Espagnol)
   - `de-DE` (Allemand)

## 🚀 Avantages vs Web Speech API

✅ **Fonctionne offline** (enregistrement)
✅ **Pas de "network error"**
✅ **Meilleure qualité de transcription**
✅ **Compatible tous navigateurs**
✅ **Contrôle total sur l'enregistrement**

## 📝 Test rapide

1. Actualisez l'application
2. Cliquez sur le bouton micro (utilisateur premium requis)
3. Parlez pendant quelques secondes
4. Cliquez à nouveau pour arrêter
5. Attendez 2-3 secondes → texte transcrit !

Console logs attendus :
```
🎤 Demande d'accès au microphone...
✅ Microphone accordé
🎵 Format audio: audio/webm;codecs=opus
▶️ Enregistrement démarré
🛑 Arrêt manuel de l'enregistrement
🔴 Enregistrement arrêté, traitement...
📦 Taille audio: 45678 bytes
🌐 Transcription en cours... fr-FR
✅ Transcription: Bonjour ceci est un test
```
