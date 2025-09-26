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

    // Pré-traitement des apostrophes pour améliorer la prononciation
    let processedText = text.replace(/’/g, "'");

    // Correction SSML pour les liaisons "d'xxx" et "l'xxx" (sauf pour Neural2/Wavenet)
  const useSub = !(voice && (voice.includes('Neural2') || voice.includes('Wavenet')));
    if (useSub) {
      processedText = processedText.replace(/\b(d|l)'([a-zA-Zéèêëàâäîïôöùûüçœ]+)/g, (match: string, p1: string, p2: string) => {
        return `<sub alias='${p1}${p2}'>${p1}'${p2}</sub>`;
      });
    }

    // Génération SSML pour la synthèse vocale
    const encoder = new TextEncoder();
    // Fonction utilitaire pour découper le texte en segments SSML < 5000 bytes
    function splitTextToSsmlSegments(text: string, maxBytes = 5000): string[] {
      const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
      const segments: string[] = [];
      let current = '';
      for (const sentence of sentences) {
        const testSegment = current ? current + ' ' + sentence : sentence;
        const testSsml = `<speak>${testSegment}</speak>`;
        if (encoder.encode(testSsml).length > maxBytes) {
          if (current) segments.push(`<speak>${current}</speak>`);
          current = sentence;
        } else {
          current = testSegment;
        }
      }
      if (current) segments.push(`<speak>${current}</speak>`);
      return segments;
    }

    const ssmlSegments = splitTextToSsmlSegments(processedText);

    // Générer l'audio pour chaque segment
  const audioBuffers: Buffer[] = [];
    for (const ssmlText of ssmlSegments) {
      let buffer: Buffer;
      if (autoAnalyze) {
        buffer = await googleStoryTeller.generateAutoStyledSpeech(ssmlText);
      } else if (style && Object.keys(STORY_VOICE_STYLES).includes(style)) {
        buffer = await googleStoryTeller.generateStyledSpeech(ssmlText, style as keyof typeof STORY_VOICE_STYLES);
      } else {
        const options: GoogleTTSOptions = {
          voice,
          speed,
          pitch,
          volumeGainDb
        };
        buffer = await googleStoryTeller.generateSpeech(ssmlText, options);
      }
      audioBuffers.push(buffer);
    }

    // Concaténer les buffers audio
    const audioBuffer = Buffer.concat(audioBuffers);

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
