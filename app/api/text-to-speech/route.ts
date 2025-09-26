import { NextRequest, NextResponse } from 'next/server';
import { googleStoryTeller, GoogleTTSOptions, STORY_VOICE_STYLES } from '@/lib/googleStoryTeller';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { 
      text, 
      voice = 'fr-FR-Wavenet-C', 
      speed = 0.9,
      pitch = 0,
      volumeGainDb = 0,
      style, // Style prédéfini
      autoAnalyze = false // Nouveau paramètre pour l'analyse automatique
    } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Texte requis' },
        { status: 400 }
      );
    }

    let audioBuffer: Buffer;

    // 🎭 Si l'analyse automatique est demandée
    if (autoAnalyze) {
      console.log('🔍 Génération avec analyse automatique du ton...');
      audioBuffer = await googleStoryTeller.generateAutoStyledSpeech(text);
    }
    // Si un style prédéfini est spécifié, l'utiliser
    else if (style && Object.keys(STORY_VOICE_STYLES).includes(style)) {
      console.log('🎭 Utilisation du style prédéfini:', style);
      audioBuffer = await googleStoryTeller.generateStyledSpeech(text, style as keyof typeof STORY_VOICE_STYLES);
    } else {
      // Sinon, utiliser les paramètres personnalisés
      const options: GoogleTTSOptions = {
        voice,
        speed,
        pitch,
        volumeGainDb
      };

      audioBuffer = await googleStoryTeller.generateSpeech(text, options);
    }

    // Retourner l'audio MP3
    let audioData: ArrayBuffer;
    if (audioBuffer instanceof Buffer) {
      audioData = audioBuffer.buffer instanceof ArrayBuffer ? audioBuffer.buffer : Buffer.from(audioBuffer).buffer;
    } else if (audioBuffer instanceof Uint8Array) {
      audioData = audioBuffer.buffer instanceof ArrayBuffer ? audioBuffer.buffer : new Uint8Array(audioBuffer).buffer;
    } else {
      audioData = audioBuffer as ArrayBuffer;
    }
    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioData.byteLength),
        'Cache-Control': 'public, max-age=31536000', // Cache 1 an côté client
        'X-Audio-Source': 'Google Cloud TTS',
      },
    });

  } catch (error) {
    console.error('Erreur TTS Google:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération audio: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// Endpoint pour les statistiques du cache (optionnel)
export async function GET() {
  try {
    const stats = googleStoryTeller.getCacheStats();
    const voices = googleStoryTeller.getAvailableVoices();
    const styles = googleStoryTeller.getAvailableStyles();
    
    return NextResponse.json({
      cache: stats,
      voices,
      styles, // Ajouter les styles disponibles
      service: 'Google Cloud Text-to-Speech'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des stats' },
      { status: 500 }
    );
  }
}
