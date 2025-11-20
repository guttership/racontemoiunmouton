'use server';

/**
 * Transcription audio via Google Cloud Speech-to-Text API
 * Convertit un fichier audio base64 en texte
 */

interface TranscriptionResult {
  success: boolean;
  transcript?: string;
  error?: string;
}

export async function transcribeAudio(
  audioBase64: string,
  languageCode: string = 'fr-FR'
): Promise<TranscriptionResult> {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ GOOGLE_AI_API_KEY manquante');
      return {
        success: false,
        error: 'Configuration API manquante',
      };
    }

    // Appel à l'API Google Cloud Speech-to-Text
    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: languageCode,
            enableAutomaticPunctuation: true,
            model: 'default',
          },
          audio: {
            content: audioBase64,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API Speech-to-Text:', response.status, errorText);
      
      // Si 403: problème de permissions
      if (response.status === 403) {
        console.error('🔑 La clé API n\'a pas accès à Speech-to-Text API');
        console.error('💡 Solution: Allez sur https://console.cloud.google.com/apis/credentials');
        console.error('💡 Éditez votre clé API et ajoutez "Cloud Speech-to-Text API" aux restrictions');
      }
      
      // Essayer avec un encoding alternatif si WEBM_OPUS échoue
      if (errorText.includes('encoding')) {
        return transcribeWithAlternativeEncoding(audioBase64, languageCode, apiKey);
      }
      
      return {
        success: false,
        error: `Erreur API: ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.warn('⚠️ Aucun résultat de transcription');
      return {
        success: false,
        error: 'Aucune parole détectée',
      };
    }

    const transcript = data.results
      .map((result: { alternatives: { transcript: string }[] }) => 
        result.alternatives[0].transcript
      )
      .join(' ');

    console.log('✅ Transcription réussie:', transcript);

    return {
      success: true,
      transcript: transcript.trim(),
    };
  } catch (error) {
    console.error('❌ Erreur transcription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Tentative avec encoding alternatif (OGG_OPUS ou LINEAR16)
 */
async function transcribeWithAlternativeEncoding(
  audioBase64: string,
  languageCode: string,
  apiKey: string
): Promise<TranscriptionResult> {
  try {
    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'OGG_OPUS',
            sampleRateHertz: 48000,
            languageCode: languageCode,
            enableAutomaticPunctuation: true,
          },
          audio: {
            content: audioBase64,
          },
        }),
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: 'Encodage audio non supporté',
      };
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return {
        success: false,
        error: 'Aucune parole détectée',
      };
    }

    const transcript = data.results
      .map((result: { alternatives: { transcript: string }[] }) => 
        result.alternatives[0].transcript
      )
      .join(' ');

    return {
      success: true,
      transcript: transcript.trim(),
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur encodage alternatif',
    };
  }
}
