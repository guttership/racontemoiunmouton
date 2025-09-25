import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Configuration du client Google TTS
let ttsClient: TextToSpeechClient | null = null;

function initializeClient() {
  if (!ttsClient) {
    // Si on a une clé API directe
    if (process.env.GOOGLE_TTS_API_KEY) {
      ttsClient = new TextToSpeechClient({
        apiKey: process.env.GOOGLE_TTS_API_KEY,
      });
    } 
    // Si on a un fichier de credentials JSON
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      ttsClient = new TextToSpeechClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });
    }
    // Configuration inline pour le déploiement
    else if (process.env.GOOGLE_CREDENTIALS) {
      const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      ttsClient = new TextToSpeechClient({
        credentials,
        projectId: credentials.project_id,
      });
    }
    else {
      throw new Error('Configuration Google Cloud manquante. Ajoutez GOOGLE_TTS_API_KEY ou GOOGLE_CREDENTIALS dans .env.local');
    }
  }
  return ttsClient;
}

// Voix françaises disponibles avec Google Cloud
export const GOOGLE_FRENCH_VOICES = {
  // Voix Standard (gratuit)
  'fr-FR-Standard-A': 'Claire - Voix féminine standard',
  'fr-FR-Standard-B': 'Henri - Voix masculine standard', 
  'fr-FR-Standard-C': 'Amélie - Voix féminine douce',
  'fr-FR-Standard-D': 'Paul - Voix masculine grave',
  
  // Voix WaveNet (premium mais naturelles)
  'fr-FR-Wavenet-A': 'Léa - Voix féminine naturelle',
  'fr-FR-Wavenet-B': 'Marc - Voix masculine naturelle',
  'fr-FR-Wavenet-C': 'Sophie - Voix chaleureuse',
  'fr-FR-Wavenet-D': 'Thomas - Voix expressive',
  
  // Voix Neural2 (plus récentes)
  'fr-FR-Neural2-A': 'Emma - Voix moderne féminine',
  'fr-FR-Neural2-B': 'Louis - Voix moderne masculine',
};

// Tons de voix prédéfinis pour histoires pour enfants
export const STORY_VOICE_STYLES = {
  gentle: {
    name: 'Doux et apaisant',
    voice: 'fr-FR-Wavenet-C',
    speed: 0.85,
    pitch: 2.0,
    volumeGainDb: -2,
    emphasis: 'low'
  },
  animated: {
    name: 'Animé et expressif',
    voice: 'fr-FR-Wavenet-D',
    speed: 1.0,
    pitch: 4.0,
    volumeGainDb: 0,
    emphasis: 'moderate'
  },
  storyteller: {
    name: 'Conteur traditionnel',
    voice: 'fr-FR-Wavenet-B',
    speed: 0.9,
    pitch: -1.0,
    volumeGainDb: 1,
    emphasis: 'strong'
  },
  motherly: {
    name: 'Maternel et chaleureux',
    voice: 'fr-FR-Wavenet-A',
    speed: 0.8,
    pitch: 1.5,
    volumeGainDb: -1,
    emphasis: 'low'
  },
  playful: {
    name: 'Ludique et enjoué',
    voice: 'fr-FR-Neural2-A',
    speed: 1.1,
    pitch: 3.0,
    volumeGainDb: 2,
    emphasis: 'moderate'
  },
  // Nouveaux styles pour différents tons d'histoire
  funny: {
    name: 'Drôle et rigolo',
    voice: 'fr-FR-Neural2-A',
    speed: 1.15,
    pitch: 3.5,
    volumeGainDb: 1,
    emphasis: 'moderate'
  },
  mysterious: {
    name: 'Mystérieux et intriguant',
    voice: 'fr-FR-Wavenet-B',
    speed: 0.8,
    pitch: -2.0,
    volumeGainDb: -1,
    emphasis: 'strong'
  },
  adventurous: {
    name: 'Aventureux et courageux',
    voice: 'fr-FR-Wavenet-D',
    speed: 1.05,
    pitch: 1.0,
    volumeGainDb: 2,
    emphasis: 'strong'
  },
  magical: {
    name: 'Magique et merveilleux',
    voice: 'fr-FR-Wavenet-C',
    speed: 0.9,
    pitch: 2.5,
    volumeGainDb: 0,
    emphasis: 'moderate'
  },
  scary_light: {
    name: 'Un peu effrayant (léger)',
    voice: 'fr-FR-Wavenet-B',
    speed: 0.85,
    pitch: -1.5,
    volumeGainDb: -2,
    emphasis: 'strong'
  }
};

export interface GoogleTTSOptions {
  voice: string;
  speed: number;
  pitch: number;
  volumeGainDb: number;
  emphasis?: 'low' | 'moderate' | 'strong';
  ssmlText?: string; // Pour des effets SSML avancés
}

export class GoogleStoryTeller {
  private cacheDir: string;
  private client: TextToSpeechClient | null = null;

  constructor() {
    this.cacheDir = path.join(process.cwd(), '.cache', 'audio');
    this.ensureCacheDir();
  }

  // Nettoyer le texte des caractères indésirables pour la lecture
  private cleanTextForSpeech(text: string): string {
    return text
      // Supprimer les astérisques et leurs contenus (actions/descriptions)
      .replace(/\*[^*]*\*/g, '')
      // Supprimer les caractères de formatage markdown
      .replace(/[*_#`~]/g, '')
      // Remplacer les guillemets par des espaces ou du contexte
      .replace(/["""''«»]/g, ' ')
      // Supprimer les crochets et leur contenu (annotations)
      .replace(/\[[^\]]*\]/g, '')
      // Supprimer les parenthèses avec annotations
      .replace(/\([^)]*\)/g, '')
      // Nettoyer les tirets multiples
      .replace(/--+/g, ' ')
      // Supprimer les caractères spéciaux problématiques
      .replace(/[§©®™±×÷]/g, '')
      // Nettoyer les espaces multiples
      .replace(/\s+/g, ' ')
      // Supprimer les espaces en début/fin
      .trim();
  }

  // Analyser automatiquement le ton de l'histoire avec l'IA
  private async analyzeStoryTone(text: string): Promise<keyof typeof STORY_VOICE_STYLES> {
    try {
      const analysisPrompt = `Analyse cette histoire pour enfants et détermine son ton principal. Réponds UNIQUEMENT par un mot parmi : gentle, animated, storyteller, motherly, playful, funny, mysterious, adventurous, magical, scary_light

Histoire : "${text.substring(0, 500)}..."

Critères :
- funny : histoire drôle, comique, pleine d'humour
- mysterious : mystère, secrets, intrigue, suspense léger
- adventurous : aventure, quête, courage, action
- magical : magie, fées, pouvoirs, merveilleux
- scary_light : un peu effrayant mais approprié aux enfants
- playful : ludique, joyeux, énergique
- gentle : doux, apaisant, pour le coucher
- motherly : tendre, réconfortant, chaleureux
- animated : expressif, vivant, dramatique
- storyteller : conte classique, narratif

Ton principal :`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GOOGLE_AI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: analysisPrompt }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const analyzedTone = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
        
        // Vérifier que la réponse est valide
        if (analyzedTone && Object.keys(STORY_VOICE_STYLES).includes(analyzedTone)) {
          console.log('🎭 Ton analysé automatiquement:', analyzedTone);
          return analyzedTone as keyof typeof STORY_VOICE_STYLES;
        }
      }
    } catch (error) {
      console.log('⚠️ Analyse automatique échouée, utilisation du ton par défaut:', error);
    }

    // Fallback : analyse simple basée sur des mots-clés
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('rigol') || lowerText.includes('drôle') || lowerText.includes('rire') || lowerText.includes('haha') || lowerText.includes('blague')) {
      return 'funny';
    } else if (lowerText.includes('mystère') || lowerText.includes('secret') || lowerText.includes('caché') || lowerText.includes('étrange')) {
      return 'mysterious';
    } else if (lowerText.includes('aventure') || lowerText.includes('courage') || lowerText.includes('héros') || lowerText.includes('quête')) {
      return 'adventurous';
    } else if (lowerText.includes('magie') || lowerText.includes('fée') || lowerText.includes('sortilège') || lowerText.includes('magique')) {
      return 'magical';
    } else if (lowerText.includes('peur') || lowerText.includes('effrayant') || lowerText.includes('sombre') || lowerText.includes('monstre')) {
      return 'scary_light';
    } else if (lowerText.includes('jeu') || lowerText.includes('jouer') || lowerText.includes('amusant')) {
      return 'playful';
    } else if (lowerText.includes('doux') || lowerText.includes('calme') || lowerText.includes('dormir')) {
      return 'gentle';
    }
    
    // Par défaut : storyteller pour un conte classique
    return 'storyteller';
  }

  private ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private generateCacheKey(text: string, options: GoogleTTSOptions): string {
    const content = JSON.stringify({ text, options });
    return crypto.createHash('md5').update(content).digest('hex');
  }

  private getCachePath(cacheKey: string): string {
    return path.join(this.cacheDir, `${cacheKey}.mp3`);
  }

  // Préprocessing spécifique selon le style de voix
  private applyVoiceStyleToText(text: string, styleKey: keyof typeof STORY_VOICE_STYLES): string {    
    let processedText = text;

    switch (styleKey) {
      case 'gentle':
        // Ton doux et apaisant
        processedText = processedText
          .replace(/(Il était une fois)/gi, '<prosody rate="slow" pitch="+2st">$1</prosody>')
          .replace(/(\bOh\b|\bAh\b)/gi, '<prosody rate="slow" pitch="+1st">$1</prosody>')
          .replace(/(\bmaman\b|\bpapa\b)/gi, '<prosody pitch="+1st">$1</prosody>')
          .replace(/\. /g, '. <break time="0.8s"/> ')
          .replace(/\n/g, ' <break time="1.2s"/> ');
        break;

      case 'animated':
        // Ton animé et expressif
        processedText = processedText
          .replace(/(!)/g, '<emphasis level="strong">$1</emphasis>')
          .replace(/(\bWow\b|\bSuper\b|\bGenial\b)/gi, '<emphasis level="strong" pitch="+3st">$1</emphasis>')
          .replace(/(Soudain|Tout à coup|Alors)/gi, '<prosody rate="fast" pitch="+2st"><emphasis level="moderate">$1</emphasis></prosody>')
          .replace(/(\?)/g, '<prosody pitch="+4st">$1</prosody>')
          .replace(/\. /g, '. <break time="0.4s"/> ');
        break;

      case 'storyteller':
        // Ton de conteur traditionnel
        processedText = processedText
          .replace(/(Il était une fois|Il y a bien longtemps)/gi, '<prosody rate="x-slow" pitch="-1st">$1</prosody>')
          .replace(/(Et ils vécurent heureux)/gi, '<prosody rate="slow" pitch="-0.5st">$1</prosody>')
          .replace(/(".*?")/g, '<prosody pitch="+1st">$1</prosody>')
          .replace(/\. /g, '. <break time="0.7s"/> ')
          .replace(/\n\n/g, ' <break time="1.5s"/> ');
        break;

      case 'motherly':
        // Ton maternel et chaleureux
        processedText = processedText
          .replace(/(\bmon chéri\b|\bma chérie\b|\bmon cœur\b)/gi, '<prosody rate="slow" pitch="+1.5st">$1</prosody>')
          .replace(/(\bdors bien\b|\bbonne nuit\b)/gi, '<prosody rate="x-slow" pitch="+1st">$1</prosody>')
          .replace(/(\bjoli\b|\bbeau\b|\bmignon\b)/gi, '<prosody pitch="+1st">$1</prosody>')
          .replace(/\. /g, '. <break time="0.6s"/> ');
        break;

      case 'playful':
        // Ton ludique et enjoué
        processedText = processedText
          .replace(/(\bHihi\b|\bHaha\b|\bHoho\b)/gi, '<prosody rate="fast" pitch="+3st">$1</prosody>')
          .replace(/(\bjeu\b|\bjouer\b|\brigoler\b)/gi, '<emphasis level="moderate" pitch="+2st">$1</emphasis>')
          .replace(/(\bYoupiii\b|\bSuper\b|\bChouette\b)/gi, '<prosody rate="fast" pitch="+4st"><emphasis level="strong">$1</emphasis></prosody>')
          .replace(/\. /g, '. <break time="0.3s"/> ');
        break;

      case 'funny':
        // Ton drôle et rigolo
        processedText = processedText
          .replace(/(\bhaha\b|\bhehe\b|\brigoler?\b)/gi, '<prosody rate="fast" pitch="+3st"><emphasis level="moderate">$1</emphasis></prosody>')
          .replace(/(\bdrôle\b|\bcomique\b|\bblague\b)/gi, '<prosody pitch="+2st">$1</prosody>')
          .replace(/(!)/g, '<emphasis level="strong" pitch="+2st">$1</emphasis>')
          .replace(/(\bOh là là\b|\bMince\b|\bZut\b)/gi, '<prosody rate="fast" pitch="+3st">$1</prosody>')
          .replace(/\. /g, '. <break time="0.2s"/> ');
        break;

      case 'mysterious':
        // Ton mystérieux et intriguant
        processedText = processedText
          .replace(/(mystère|secret|caché|étrange)/gi, '<prosody rate="slow" pitch="-2st"><emphasis level="moderate">$1</emphasis></prosody>')
          .replace(/(Soudain)/gi, '<prosody rate="x-slow" pitch="-1st"><emphasis level="strong">$1</emphasis></prosody>')
          .replace(/(\?)/g, '<prosody rate="slow" pitch="-1st">$1</prosody>')
          .replace(/\. /g, '. <break time="1s"/> ')
          .replace(/\.\.\./g, '<break time="1.5s"/>');
        break;

      case 'adventurous':
        // Ton aventureux et courageux
        processedText = processedText
          .replace(/(aventure|courage|héros|quête)/gi, '<emphasis level="strong" pitch="+1st">$1</emphasis>')
          .replace(/(En avant|Allons-y|Courage)/gi, '<prosody rate="fast" pitch="+2st"><emphasis level="strong">$1</emphasis></prosody>')
          .replace(/(!)/g, '<emphasis level="strong">$1</emphasis>')
          .replace(/\. /g, '. <break time="0.5s"/> ');
        break;

      case 'magical':
        // Ton magique et merveilleux
        processedText = processedText
          .replace(/(magie|magique|fée|sortilège|merveilleux)/gi, '<prosody pitch="+2st"><emphasis level="moderate">$1</emphasis></prosody>')
          .replace(/(Abracadabra|Sim sala bim)/gi, '<prosody rate="slow" pitch="+3st">$1</prosody>')
          .replace(/(brillait|scintillait|étincelait)/gi, '<prosody pitch="+1st">$1</prosody>')
          .replace(/\. /g, '. <break time="0.6s"/> ');
        break;

      case 'scary_light':
        // Ton un peu effrayant mais approprié aux enfants
        processedText = processedText
          .replace(/(peur|effrayant|sombre|mystérieux)/gi, '<prosody rate="slow" pitch="-1.5st">$1</prosody>')
          .replace(/(Attention|Prudence)/gi, '<prosody rate="slow" pitch="-1st"><emphasis level="moderate">$1</emphasis></prosody>')
          .replace(/(Mais tout va bien|Heureusement)/gi, '<prosody rate="medium" pitch="+1st">$1</prosody>')
          .replace(/\. /g, '. <break time="0.8s"/> ');
        break;
    }

    return processedText;
  }

  private preprocessStoryText(text: string, voiceStyle?: keyof typeof STORY_VOICE_STYLES): string {
    // 1. D'abord nettoyer le texte des caractères indésirables
    const cleanedText = this.cleanTextForSpeech(text);
    
    // 2. Appliquer le style de voix spécifique si fourni
    const styledText = voiceStyle ? this.applyVoiceStyleToText(cleanedText, voiceStyle) : cleanedText;
    
    // 3. Appliquer les améliorations générales pour la lecture
    return styledText
      .replace(/\s+/g, ' ')
      .trim()
      // Améliorer la prononciation
      .replace(/\boh\b/gi, 'ô')
      .replace(/\bah\b/gi, 'ââh')
      // Ajouter des pauses avec SSML seulement si pas déjà fait par le style
      .replace(/\. (?!<break)/g, '. <break time="0.5s"/> ')
      .replace(/! (?!<break)/g, '! <break time="0.6s"/> ')
      .replace(/\? (?!<break)/g, '? <break time="0.6s"/> ')
      .replace(/\n\n/g, ' <break time="1s"/> ')
      // Expressivité pour les histoires (si pas déjà appliquée)
      .replace(/(Il était une fois)(?!<\/prosody>)/gi, '<prosody rate="slow">$1</prosody>')
      .replace(/(Soudain|Tout à coup)(?!<\/prosody>)/gi, '<emphasis level="moderate">$1</emphasis>');
  }

  public async generateSpeech(
    text: string, 
    options: GoogleTTSOptions = {
      voice: 'fr-FR-Wavenet-C', // Sophie par défaut
      speed: 0.9,
      pitch: 0,
      volumeGainDb: 0
    },
    voiceStyle?: keyof typeof STORY_VOICE_STYLES
  ): Promise<Buffer> {
    
    // Vérifier le cache d'abord
    const cacheKey = this.generateCacheKey(text, options);
    const cachePath = this.getCachePath(cacheKey);
    
    if (fs.existsSync(cachePath)) {
      console.log('Audio trouvé dans le cache');
      return fs.readFileSync(cachePath);
    }

    // Initialiser le client si nécessaire
    if (!this.client) {
      this.client = initializeClient();
    }

    console.log('🎤 Génération audio avec Google Cloud TTS...');

    // Préparer le texte avec SSML pour une meilleure expressivité
    const ssmlText = `<speak>${this.preprocessStoryText(text, voiceStyle)}</speak>`;

    // Configuration de la requête
    const request = {
      input: { ssml: ssmlText },
      voice: { 
        languageCode: 'fr-FR', 
        name: options.voice 
      },
      audioConfig: { 
        audioEncoding: 'MP3' as const,
        speakingRate: options.speed,
        pitch: options.pitch,
        volumeGainDb: options.volumeGainDb,
        sampleRateHertz: 22050, // Qualité CD pour les histoires
      },
    };

    try {
      // Appeler l'API Google
      const [response] = await this.client.synthesizeSpeech(request);
      
      if (!response.audioContent) {
        throw new Error('Pas de contenu audio reçu');
      }

      // Convertir en Buffer
      const audioBuffer = Buffer.from(response.audioContent as Uint8Array);
      
      // Sauvegarder dans le cache
      fs.writeFileSync(cachePath, audioBuffer);
      console.log('💾 Audio mis en cache');

      return audioBuffer;

    } catch (error) {
      console.error('❌ Erreur Google TTS:', error);
      throw new Error(`Erreur de génération audio: ${error}`);
    }
  }

  public getAvailableVoices(): typeof GOOGLE_FRENCH_VOICES {
    return GOOGLE_FRENCH_VOICES;
  }

  // Méthode helper pour générer un speech avec un style prédéfini
  public async generateStyledSpeech(
    text: string,
    styleKey: keyof typeof STORY_VOICE_STYLES
  ): Promise<Buffer> {
    const style = STORY_VOICE_STYLES[styleKey];
    
    const options: GoogleTTSOptions = {
      voice: style.voice,
      speed: style.speed,
      pitch: style.pitch,
      volumeGainDb: style.volumeGainDb,
      emphasis: style.emphasis
    };

    return this.generateSpeech(text, options, styleKey);
  }

  // 🎭 NOUVELLE MÉTHODE : Génération automatique avec analyse du ton
  public async generateAutoStyledSpeech(text: string): Promise<Buffer> {
    console.log('🔍 Analyse automatique du ton de l\'histoire...');
    const detectedStyle = await this.analyzeStoryTone(text);
    console.log('🎭 Style détecté:', detectedStyle, '-', STORY_VOICE_STYLES[detectedStyle].name);
    
    return this.generateStyledSpeech(text, detectedStyle);
  }

  // Obtenir la liste des styles disponibles
  public getAvailableStyles() {
    return Object.entries(STORY_VOICE_STYLES).map(([key, style]) => ({
      key: key as keyof typeof STORY_VOICE_STYLES,
      name: style.name,
      voice: style.voice,
      description: `Vitesse: ${style.speed}, Ton: ${style.pitch > 0 ? 'Aigu' : style.pitch < 0 ? 'Grave' : 'Normal'}`
    }));
  }

  public getCacheStats(): { files: number; sizeMB: number } {
    try {
      const files = fs.readdirSync(this.cacheDir);
      const totalSize = files.reduce((size, file) => {
        const filePath = path.join(this.cacheDir, file);
        const stats = fs.statSync(filePath);
        return size + stats.size;
      }, 0);

      return {
        files: files.length,
        sizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100
      };
    } catch {
      return { files: 0, sizeMB: 0 };
    }
  }

  public clearCache(): void {
    try {
      const files = fs.readdirSync(this.cacheDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(this.cacheDir, file));
      });
      console.log('🗑️ Cache audio vidé');
    } catch (error) {
      console.error('Erreur lors du vidage du cache:', error);
    }
  }
}

// Instance singleton
export const googleStoryTeller = new GoogleStoryTeller();
