import { NextRequest, NextResponse } from 'next/server';
import { googleStoryTeller, GoogleTTSOptions } from '@/lib/googleStoryTeller';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('API TTS appelée');
  // Déclaration des variables au niveau fonction pour accès dans le bloc catch
  let text: string = '';
  let voice: string;
  let speed: number;
  let pitch: number;
  let volumeGainDb: number;
  let processedText: string = '';
  let ssmlSegments: string[] = [];
  let locale: string = 'fr';
  try {
    try {
      const body = await request.json();
      text = body.text;
      voice = body.voice ?? 'fr-FR-Wavenet-E';
      speed = body.speed ?? 1.0;
      pitch = body.pitch ?? 0.0;
      volumeGainDb = body.volumeGainDb ?? 0.0;
      locale = body.locale ?? 'fr'; // Récupérer la locale
    } catch (jsonError) {
      return new NextResponse(
        JSON.stringify({
          error: 'Le corps de la requête n\'est pas un JSON valide.',
          details: {
            message: (jsonError as Error).message,
            stack: (jsonError as Error).stack
          }
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!text) {
      return NextResponse.json(
        { error: 'Texte requis' },
        { status: 400 }
      );
    }

    // Pré-traitement selon la langue
    processedText = text.replace(/'/g, "'");
    
    // Traitement spécifique au français pour les élisions
    if (locale === 'fr') {
      processedText = processedText!.replace(/\b(l|d|j|n|s|c|m|t|qu)'([a-zA-Zéèêëàâäîïôöùûüçœ]+)/g, (match: string, p1: string, p2: string) => {
        return `${p1}${p2}`;
      });
    }
    // Pour l'anglais, améliorer les contractions
    else if (locale === 'en') {
      // Normaliser les contractions anglaises
      processedText = processedText.replace(/(\w+)'(s|re|ve|d|ll|t|m)/gi, (match, p1, p2) => {
        return `${p1}'${p2}`;
      });
    }
    // Pour l'espagnol et l'allemand, garder le texte tel quel
    // (pas de traitement spécifique nécessaire)

    // Génération SSML pour la synthèse vocale
    const encoder = new TextEncoder();
    // Fonction utilitaire pour découper le texte en segments SSML < 5000 bytes
    function splitTextToSsmlSegments(text: string, maxBytes = 5000): string[] {
      // Découpage initial par phrase
      const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
      const segments: string[] = [];
      let current = '';
      for (const sentence of sentences) {
        const testSegment = current ? current + ' ' + sentence : sentence;
        const testSsml = `<speak>${testSegment}</speak>`;
        if (encoder.encode(testSsml).length > maxBytes) {
          // Si la phrase seule dépasse la limite, découper en sous-phrases
          if (encoder.encode(`<speak>${sentence}</speak>`).length > maxBytes) {
            // Découpage par virgule ou espace
            const subparts = sentence.split(/,|;|\s/);
            let subCurrent = '';
            for (const part of subparts) {
              const testSub = subCurrent ? subCurrent + ' ' + part : part;
              const testSubSsml = `<speak>${testSub}</speak>`;
              if (encoder.encode(testSubSsml).length > maxBytes) {
                // Si le mot seul dépasse la limite, on le découpe caractère par caractère
                for (const char of part) {
                  const testChar = subCurrent ? subCurrent + char : char;
                  const testCharSsml = `<speak>${testChar}</speak>`;
                  if (encoder.encode(testCharSsml).length > maxBytes) {
                    if (subCurrent) segments.push(`<speak>${subCurrent}</speak>`);
                    subCurrent = char;
                  } else {
                    subCurrent = testChar;
                  }
                }
                if (subCurrent) segments.push(`<speak>${subCurrent}</speak>`);
                subCurrent = '';
              } else {
                subCurrent = testSub;
              }
            }
            if (subCurrent) segments.push(`<speak>${subCurrent}</speak>`);
          } else {
            if (current) segments.push(`<speak>${current}</speak>`);
            current = sentence;
          }
        } else {
          current = testSegment;
        }
      }
      if (current) segments.push(`<speak>${current}</speak>`);
      return segments;
    }

    // Vérification stricte des segments SSML
    function enforceSsmlLimit(segments: string[], maxBytes = 5000): string[] {
      const validSegments: string[] = [];
      for (const ssml of segments) {
        if (encoder.encode(ssml).length <= maxBytes) {
          validSegments.push(ssml);
        } else {
          // Découper le contenu entre <speak>...</speak>
          const content = ssml.replace(/^<speak>|<\/speak>$/g, '');
          const words = content.split(/\s+/);
          let current = '';
          for (const word of words) {
            const test = current ? current + ' ' + word : word;
            const testSsml = `<speak>${test}</speak>`;
            if (encoder.encode(testSsml).length > maxBytes) {
              if (current) validSegments.push(`<speak>${current}</speak>`);
              current = word;
            } else {
              current = test;
            }
          }
          if (current) validSegments.push(`<speak>${current}</speak>`);
        }
      }
      return validSegments;
    }

  // Découpage strict : appliquer splitTextToSsmlSegments APRÈS le pré-traitement SSML
  // pour garantir que chaque segment final (avec balises) < 5000 bytes
  ssmlSegments = splitTextToSsmlSegments(processedText);
  ssmlSegments = enforceSsmlLimit(ssmlSegments);
  // Double passe : si un segment dépasse encore la limite, le re-découper
  // Découpage mot par mot si un segment dépasse encore la limite
  function splitSsmlByWords(ssml: string, maxBytes = 5000): string[] {
    const content = ssml.replace(/^<speak>|<\/speak>$/g, '');
    const words = content.split(/\s+/);
    const segments: string[] = [];
    let current = '';
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      const testSsml = `<speak>${test}</speak>`;
      if (encoder.encode(testSsml).length > maxBytes) {
        if (current) segments.push(`<speak>${current}</speak>`);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) segments.push(`<speak>${current}</speak>`);
    return segments;
  }
  ssmlSegments = ssmlSegments.flatMap(seg => encoder.encode(seg).length > 5000 ? splitSsmlByWords(seg) : [seg]);
  // Filtrer les segments trop longs
  ssmlSegments = ssmlSegments.map(seg => {
    if (encoder.encode(seg).length <= 5000) return seg;
    // Découpage par mot si besoin
    const content = seg.replace(/^<speak>|<\/speak>$/g, '');
    const words = content.split(/\s+/);
    let current = '';
    const segments: string[] = [];
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      const testSsml = `<speak>${test}</speak>`;
      if (encoder.encode(testSsml).length > 5000) {
        if (current) segments.push(`<speak>${current}</speak>`);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) segments.push(`<speak>${current}</speak>`);
    return segments;
  }).flat();

    // Vérification FINALE : s'assurer que tous les segments sont < 5000 bytes
    const finalSegments: string[] = [];
    for (const seg of ssmlSegments) {
      const segSize = encoder.encode(seg).length;
      if (segSize > 5000) {
        console.warn('⚠️ Segment SSML trop long détecté:', segSize, 'bytes. Découpage agressif...');
        // Extraire le texte brut (sans balises SSML)
        const plainText = seg.replace(/<[^>]+>/g, '');
        const words = plainText.split(/\s+/);
        let current = '';
        for (const word of words) {
          const test = current ? current + ' ' + word : word;
          const testSsml = `<speak>${test}</speak>`;
          if (encoder.encode(testSsml).length > 4900) { // Marge de sécurité
            if (current) finalSegments.push(`<speak>${current}</speak>`);
            current = word;
          } else {
            current = test;
          }
        }
        if (current) finalSegments.push(`<speak>${current}</speak>`);
      } else {
        finalSegments.push(seg);
      }
    }

    // Générer l'audio pour chaque segment
    const audioBuffers: Buffer[] = [];
    for (const ssmlText of finalSegments) {
      // Log taille du segment SSML
      const ssmlSize = encoder.encode(ssmlText).length;
      if (ssmlSize > 5000) {
        console.error('❌ ERREUR CRITIQUE: Segment SSML encore trop long après découpage:', ssmlSize, ssmlText.slice(0, 100));
        throw new Error(`Segment SSML trop long: ${ssmlSize} bytes`);
      }
      
      // Appel TTS normal
      // Toujours utiliser la voix spécifiée (pas de style auto qui force une voix française)
      const options: GoogleTTSOptions = { voice, speed, pitch, volumeGainDb };
      const buffer = await googleStoryTeller.generateSpeech(ssmlText, options, undefined, true);
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
    // Sécurise le retour d'erreur pour éviter les ReferenceError
    return new NextResponse(
      JSON.stringify({
        error: 'Erreur lors de la génération audio: ' + (error as Error).message,
        details: {
          stack: (error as Error).stack,
          input: {
            text: typeof text !== 'undefined' ? text : null,
            processedText: typeof processedText !== 'undefined' ? processedText : null,
            ssmlSegments: typeof ssmlSegments !== 'undefined' ? (typeof ssmlSegments === 'object' ? ssmlSegments.slice(0, 5) : ssmlSegments) : null
          }
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
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
