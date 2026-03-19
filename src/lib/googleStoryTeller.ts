import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Configuration du client Google TTS
let ttsClient: TextToSpeechClient | null = null;
const GEMINI_TONE_MODEL = process.env.GOOGLE_GEMINI_TONE_MODEL || process.env.GOOGLE_GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

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
  soft: {
    name: 'Doux et apaisant',
    voice: 'fr-FR-Wavenet-C',
    speed: 0.85,
    pitch: 2.0,
    volumeGainDb: -2,
    emphasis: 'low'
  } as const,
  animated: {
    name: 'Animé et expressif',
    voice: 'fr-FR-Wavenet-D',
    speed: 1.0,
    pitch: 4.0,
    volumeGainDb: 0,
    emphasis: 'moderate'
  } as const,
  storyteller: {
    name: 'Conteur traditionnel',
    voice: 'fr-FR-Wavenet-B',
    speed: 0.9,
    pitch: -1.0,
    volumeGainDb: 1,
    emphasis: 'strong'
  } as const,
  motherly: {
    name: 'Maternel et chaleureux',
    voice: 'fr-FR-Wavenet-A',
    speed: 0.8,
    pitch: 1.5,
    volumeGainDb: -1,
    emphasis: 'low'
  } as const,
  playful: {
    name: 'Ludique et enjoué',
    voice: 'fr-FR-Neural2-A',
    speed: 1.1,
    pitch: 3.0,
    volumeGainDb: 2,
    emphasis: 'moderate'
  } as const,
  funny: {
    name: 'Drôle et rigolo',
    voice: 'fr-FR-Neural2-A',
    speed: 1.15,
    pitch: 3.5,
    volumeGainDb: 1,
    emphasis: 'moderate'
  } as const,
  mysterious: {
    name: 'Mystérieux et intriguant',
    voice: 'fr-FR-Wavenet-B',
    speed: 0.8,
    pitch: -2.0,
    volumeGainDb: -1,
    emphasis: 'strong'
  } as const,
  adventurous: {
    name: 'Aventureux et courageux',
    voice: 'fr-FR-Wavenet-D',
    speed: 1.05,
    pitch: 1.0,
    volumeGainDb: 2,
    emphasis: 'strong'
  } as const,
  magical: {
    name: 'Magique et merveilleux',
    voice: 'fr-FR-Wavenet-C',
    speed: 0.9,
    pitch: 2.5,
    volumeGainDb: 0,
    emphasis: 'moderate'
  } as const,
  scary_light: {
    name: 'Un peu effrayant (léger)',
    voice: 'fr-FR-Wavenet-B',
    speed: 0.85,
    pitch: -1.5,
    volumeGainDb: -2,
    emphasis: 'strong'
  } as const
};

export interface GoogleTTSOptions {
  voice: string;
  speed: number;
  pitch: number;
  volumeGainDb: number;
  emphasis?: 'low' | 'moderate' | 'strong' | undefined;
  ssmlText?: string; // Pour des effets SSML avancés
}

export class GoogleStoryTeller {
  private cacheDir: string;
  private client: TextToSpeechClient | null = null;

  constructor() {
    // Utilisation de /tmp/audio pour compatibilité serverless Vercel
    this.cacheDir = path.join('/tmp', 'audio');
    this.ensureCacheDir();
  }

  // Nettoyer le texte des caractères indésirables pour la lecture
  private cleanTextForSpeech(text: string): string {
    return text
      // Supprimer les astérisques et leurs contenus (actions/descriptions)
      .replace(/\*[^*]*\*/g, '')
      // Supprimer les caractères de formatage markdown
      .replace(/[*_#`~]/g, '')
      // IMPORTANT : Supprimer TOUS les types de guillemets (ASCII, Unicode, français)
      .replace(/["""''«»„‟‹›❝❞❮❯〝〞〟]/g, '')
      // Supprimer les mentions de ponctuation prononcées (guillemets, parenthèses, etc.)
      .replace(/\b(guillemets?|ouvre guillemets?|ferme guillemets?|ouverture de guillemets?|fermeture de guillemets?|double guillemets?)\b/gi, '')
      .replace(/\b(parenthèse|ouvre parenthèse|ferme parenthèse|entre parenthèses)\b/gi, '')
      .replace(/\b(crochet|ouvre crochet|ferme crochet)\b/gi, '')
      .replace(/\b(apostrophe|virgule|point|deux points|point virgule)\s+(?=[A-Z])/gi, '')
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
      const analysisPrompt = `Analyse cette histoire pour enfants et détermine son ton principal. Réponds UNIQUEMENT par un mot parmi : soft, animated, storyteller, motherly, playful, funny, mysterious, adventurous, magical, scary_light

Histoire : "${text.substring(0, 500)}..."

Critères :
- funny : histoire drôle, comique, pleine d'humour
- mysterious : mystère, secrets, intrigue, suspense léger
- adventurous : aventure, quête, courage, action
- magical : magie, fées, pouvoirs, merveilleux
- scary_light : un peu effrayant mais approprié aux enfants
- playful : ludique, joyeux, énergique
- soft : doux, apaisant, pour le coucher
- motherly : tendre, réconfortant, chaleureux
- animated : expressif, vivant, dramatique
- storyteller : conte classique, narratif

Ton principal :`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_TONE_MODEL + ':generateContent?key=' + process.env.GOOGLE_AI_API_KEY, {
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
      return 'soft';
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
      case 'soft':
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
    let cleanedText = this.cleanTextForSpeech(text);

    // 1b. Traiter les onomatopées pour une prononciation naturelle et expressive
    cleanedText = cleanedText
      // Onomatopées de rire
      .replace(/\bhaha+\b/gi, '<say-as interpret-as="verbatim">haha</say-as>')
      .replace(/\bhehe+\b/gi, '<say-as interpret-as="verbatim">hehe</say-as>')
      .replace(/\bhihi+\b/gi, '<say-as interpret-as="verbatim">hihi</say-as>')
      .replace(/\bhoho+\b/gi, '<say-as interpret-as="verbatim">hoho</say-as>')
      // Onomatopées d'exclamation
      .replace(/\bpfff+\b/gi, '<prosody rate="slow"><say-as interpret-as="verbatim">pff</say-as></prosody>')
      .replace(/\bpfou+f+\b/gi, '<prosody rate="slow"><say-as interpret-as="verbatim">pfouf</say-as></prosody>')
      .replace(/\bouf+\b/gi, '<say-as interpret-as="verbatim">ouf</say-as>')
      .replace(/\baïe+\b/gi, '<prosody pitch="+2st"><say-as interpret-as="verbatim">aïe</say-as></prosody>')
      // Onomatopées de froid/frisson
      .replace(/\bbrrr+\b/gi, '<prosody rate="fast" pitch="-1st"><say-as interpret-as="verbatim">brrr</say-as></prosody>')
      // Onomatopées de surprise
      .replace(/\boh+\b/gi, '<prosody pitch="+2st" rate="slow">oh</prosody>')
      .replace(/\bah+\b/gi, '<prosody pitch="+2st" rate="slow">ah</prosody>')
      .replace(/\beuh+\b/gi, '<prosody rate="slow">euh</prosody>')
      // Onomatopées d'animaux
      .replace(/\bmiaou+\b/gi, '<prosody pitch="+3st"><say-as interpret-as="verbatim">miaou</say-as></prosody>')
      .replace(/\bwouaf+\b/gi, '<prosody pitch="-1st"><say-as interpret-as="verbatim">ouaf</say-as></prosody>')
      .replace(/\bmeuh+\b/gi, '<prosody pitch="-2st"><say-as interpret-as="verbatim">meuh</say-as></prosody>')
      .replace(/\bcoin coin\b/gi, '<say-as interpret-as="verbatim">coin coin</say-as>')
      .replace(/\bcocorico+\b/gi, '<prosody pitch="+2st"><say-as interpret-as="verbatim">cocorico</say-as></prosody>')
      // Onomatopées de choc/bruit
      .replace(/\bboum+\b/gi, '<emphasis level="strong"><say-as interpret-as="verbatim">boum</say-as></emphasis>')
      .replace(/\bpaf+\b/gi, '<emphasis level="strong"><say-as interpret-as="verbatim">paf</say-as></emphasis>')
      .replace(/\bbang+\b/gi, '<emphasis level="strong"><say-as interpret-as="verbatim">bang</say-as></emphasis>')
      .replace(/\bplouf+\b/gi, '<say-as interpret-as="verbatim">plouf</say-as>')
      .replace(/\bsplash+\b/gi, '<say-as interpret-as="verbatim">splash</say-as>')
      // Onomatopées de mouvement
      .replace(/\bzip+\b/gi, '<prosody rate="fast"><say-as interpret-as="verbatim">zip</say-as></prosody>')
      .replace(/\bvroum+\b/gi, '<prosody pitch="-1st"><say-as interpret-as="verbatim">vroum</say-as></prosody>')
      .replace(/\btchoutchou+\b/gi, '<prosody rate="medium"><say-as interpret-as="verbatim">tchoutchou</say-as></prosody>');

    // 2. Améliorer la prononciation avec <sub alias=""> au lieu de <phoneme>
    // IMPORTANT : Traiter "c'est" et contractions AVANT les autres formes
    cleanedText = cleanedText
      .replace(/\bc'est\b/gi, '<sub alias="sè">c\'est</sub>')
      .replace(/\bs'est\b/gi, '<sub alias="sè">s\'est</sub>')
      .replace(/\bc'était\b/gi, '<sub alias="sétè">c\'était</sub>')
      .replace(/\bn'est\b/gi, '<sub alias="nè">n\'est</sub>')
      .replace(/\bqu'est-ce\b/gi, '<sub alias="kèsse">qu\'est-ce</sub>')
      .replace(/\bqu'est\b/gi, '<sub alias="kè">qu\'est</sub>')
      .replace(/\bqu'on\b/gi, '<sub alias="kon">qu\'on</sub>')
      .replace(/\bqu'il\b/gi, '<sub alias="kil">qu\'il</sub>')
      .replace(/\bqu'elle\b/gi, '<sub alias="kèl">qu\'elle</sub>')
      .replace(/\bqu'ils\b/gi, '<sub alias="kil">qu\'ils</sub>')
      .replace(/\bqu'elles\b/gi, '<sub alias="kèl">qu\'elles</sub>')
      .replace(/\bqu'un\b/gi, '<sub alias="kun">qu\'un</sub>')
      .replace(/\bqu'une\b/gi, '<sub alias="kune">qu\'une</sub>');
    
    // Formes du verbe être avec prononciation simplifiée
    cleanedText = cleanedText
      .replace(/\best\b(?!')/gi, '<sub alias="è">est</sub>') // "est" seul
      .replace(/\bsont\b/gi, '<sub alias="son">sont</sub>') // s muet
      .replace(/\bsuis\b/gi, '<sub alias="sui">suis</sub>') // s muet
      .replace(/\bes\b/gi, '<sub alias="è">es</sub>')
      .replace(/\bsommes\b/gi, '<sub alias="somme">sommes</sub>')
      .replace(/\bêtes\b/gi, '<sub alias="ète">êtes</sub>');

    // 2b. Améliorer la prononciation d'autres verbes et mots courants avec 's' muet
    cleanedText = cleanedText
      .replace(/\btous\b/gi, '<sub alias="tou">tous</sub>')
      .replace(/\bplus\b(?!\s+de)/gi, '<sub alias="plu">plus</sub>') // "plus" sans liaison
      .replace(/\bavez\b/gi, '<sub alias="avé">avez</sub>')
      .replace(/\ballez\b/gi, '<sub alias="allé">allez</sub>')
      .replace(/\bfaites\b/gi, '<sub alias="fête">faites</sub>')
      .replace(/\bdites\b/gi, '<sub alias="dite">dites</sub>');

    // 2c. Correction des liaisons obligatoires et prononciation correcte
    cleanedText = cleanedText
      .replace(/\bils ont\b/gi, '<sub alias="il zon">ils ont</sub>')
      .replace(/\belles ont\b/gi, '<sub alias="elle zon">elles ont</sub>')
      .replace(/\bun enfant\b/gi, '<sub alias="un nanfan">un enfant</sub>')
      .replace(/\bun ami\b/gi, '<sub alias="un nami">un ami</sub>')
      .replace(/\bun animal\b/gi, '<sub alias="un nanimal">un animal</sub>')
      .replace(/\bmon ami\b/gi, '<sub alias="mon nami">mon ami</sub>')
      .replace(/\bton ami\b/gi, '<sub alias="ton nami">ton ami</sub>')
      .replace(/\bson ami\b/gi, '<sub alias="son nami">son ami</sub>');

    // 2d. Améliorer la prononciation des mots avec 'e' muet final
    cleanedText = cleanedText
      .replace(/\bpetite\b/gi, '<sub alias="petite">petite</sub>')
      .replace(/\bgrande\b/gi, '<sub alias="grande">grande</sub>')
      .replace(/\bjolie\b/gi, '<sub alias="joli">jolie</sub>');

    // 2e. Corriger les verbes à l'infinitif en -er (r muet) - RÈGLE GÉNÉRIQUE SIMPLE
    // Règle générique pour les verbes en -er (r muet)
    cleanedText = cleanedText.replace(/\b([a-zàâäéèêëïîôùûüÿœæç]{3,})er\b/gi, (match, stem) => {
      // Ne pas traiter si c'est un nom commun avec "er", ou si le mot est trop court
      const exceptions = ['mer', 'fer', 'ver', 'cher', 'amer', 'hier', 'fier', 'cuiller', 'enfer', 'hiver', 'super', 'laser', 'poster', 'cancer', 'enter'];
      if (exceptions.includes(match.toLowerCase())) return match;
      // Ne pas traiter les mots en -ter, -der, -ger si trop courts (peut être un nom)
      if (match.length <= 4) return match;
      return `<sub alias="${stem}é">${match}</sub>`;
    });
    
    // 2f. Corriger les verbes en -ir (prononciation correcte)
    cleanedText = cleanedText
      .replace(/\benvahir\b/gi, '<sub alias="anvair">envahir</sub>')
      .replace(/\bréunir\b/gi, '<sub alias="réunir">réunir</sub>')
      .replace(/\bchoisir\b/gi, '<sub alias="choazir">choisir</sub>')
      .replace(/\bfinir\b/gi, '<sub alias="finir">finir</sub>')
      .replace(/\bpunir\b/gi, '<sub alias="punir">punir</sub>')
      .replace(/\bréfléchir\b/gi, '<sub alias="réfléchir">réfléchir</sub>');

    // Ajout de pauses SSML après les liaisons et fins de phrases pour une lecture plus naturelle
    cleanedText = cleanedText
      .replace(/(\b(?:ils|elles|nous|vous|on|tu|je|le|la|les|des|mes|tes|ses|ces|mon|ton|son|un|une|du|au|aux|en|y)\b [a-zéèêëàâäîïôöùûüçœ]+)( )/gi, '$1<break time="0.2s"/> ')
      .replace(/([.!?])\s*/g, '$1 <break time="0.5s"/> ');

    // 3. Appliquer le style de voix spécifique si fourni
    const styledText = voiceStyle ? this.applyVoiceStyleToText(cleanedText, voiceStyle) : cleanedText;

    // 4. Appliquer les améliorations générales pour la lecture
    return styledText
      .replace(/\s+/g, ' ')
      .trim()
      // Améliorer la prononciation des interjections et sons
      .replace(/\boh\b/gi, '<sub alias="o">oh</sub>')
      .replace(/\bah\b/gi, '<sub alias="a">ah</sub>')
      .replace(/\bhé\b/gi, '<sub alias="é">hé</sub>')
      .replace(/\beh bien\b/gi, '<sub alias="é bien">eh bien</sub>')
      .replace(/\bouh\b/gi, '<sub alias="ou">ouh</sub>')
      // Améliorer la prononciation des nombres
      .replace(/\bsix\b(?!\s+[aeiouyéèêëàâäîïôöùûüh])/gi, '<sub alias="sisse">six</sub>') // six seul
      .replace(/\bsix\b(?=\s+[aeiouyéèêëàâäîïôöùûüh])/gi, '<sub alias="size">six</sub>') // six + voyelle
      .replace(/\bdix\b(?!\s+[aeiouyéèêëàâäîïôöùûüh])/gi, '<sub alias="disse">dix</sub>') // dix seul
      .replace(/\bdix\b(?=\s+[aeiouyéèêëàâäîïôöùûüh])/gi, '<sub alias="dize">dix</sub>') // dix + voyelle
      .replace(/\bhuit\b/gi, '<sub alias="huit">huit</sub>')
      .replace(/\bvingt\b(?=\s)/gi, '<sub alias="vin">vingt</sub>')
      // Améliorer la prononciation des mots avec 'ch'
      .replace(/\bchut\b/gi, '<sub alias="chute">chut</sub>')
      // Ajouter des pauses avec SSML seulement si pas déjà fait par le style
      .replace(/\. (?!<break)/g, '. <break time="0.5s"/> ')
      .replace(/! (?!<break)/g, '! <break time="0.6s"/> ')
      .replace(/\? (?!<break)/g, '? <break time="0.6s"/> ')
      .replace(/\n\n/g, ' <break time="1s"/> ')
      .replace(/,(?!\s*<break)/g, ',<break time="0.3s"/> ')
      .replace(/;(?!\s*<break)/g, ';<break time="0.4s"/> ')
      // Expressivité pour les histoires (si pas déjà appliquée)
      .replace(/(Il était une fois)(?!<\/prosody>)/gi, '<prosody rate="slow">$1</prosody>')
      .replace(/(Soudain|Tout à coup)(?!<\/prosody>)/gi, '<emphasis level="moderate">$1</emphasis>')
      .replace(/(chuchot|murmur|doucement)/gi, '<prosody volume="soft">$1</prosody>')
      .replace(/(cri|hurle|fort)/gi, '<prosody volume="loud">$1</prosody>');
  }

  public async generateSpeech(
    text: string,
    options: GoogleTTSOptions = {
      voice: 'fr-FR-Wavenet-C',
      speed: 0.9,
      pitch: 0,
      volumeGainDb: 0
    },
    voiceStyle?: keyof typeof STORY_VOICE_STYLES,
    isSsml: boolean = false
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

    // Si le texte est déjà SSML, ne pas retraiter ni encapsuler
    let ssmlText = isSsml ? text : `<speak>${this.preprocessStoryText(text, voiceStyle)}</speak>`;
    
    // Protection contre le double encapsulation
    if (ssmlText.includes('<speak><speak>')) {
      console.warn('⚠️ Double encapsulation SSML détectée, nettoyage...');
      ssmlText = ssmlText.replace(/<speak><speak>/g, '<speak>').replace(/<\/speak><\/speak>/g, '</speak>');
    }

    // Vérification stricte de la taille SSML avant envoi
    const encoder = new TextEncoder();
    const ssmlSize = encoder.encode(ssmlText).length;
    if (ssmlSize > 5000) {
      throw new Error(`Segment SSML trop long pour Google TTS: ${ssmlSize} bytes (limite: 5000 bytes). Texte: ${ssmlText.substring(0, 100)}...`);
    }

    // Extraire le code de langue de la voix (ex: "fr-FR" depuis "fr-FR-Neural2-A")
    const languageCode = options.voice.split('-').slice(0, 2).join('-');

    // Configuration de la requête
    const request = {
      input: { ssml: ssmlText },
      voice: { 
        languageCode, 
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

    // Détecter si le texte est déjà SSML
    const isSsml = text.trim().startsWith('<speak>');
    return this.generateSpeech(text, options, styleKey, isSsml);
  }

  // 🎭 NOUVELLE MÉTHODE : Génération automatique avec analyse du ton
  public async generateAutoStyledSpeech(text: string): Promise<Buffer> {
    console.log('🔍 Analyse automatique du ton de l\'histoire...');
    // Extraire le texte brut pour l'analyse (sans balises SSML)
    const plainText = text.replace(/<[^>]+>/g, '');
    const detectedStyle = await this.analyzeStoryTone(plainText);
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
