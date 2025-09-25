import { NextResponse } from 'next/server';

interface GoogleVoice {
  name: string;
  languageCodes: string[];
  ssmlGender: string;
}

interface GoogleVoicesResponse {
  voices: GoogleVoice[];
}

export async function GET() {
  try {
    // Test simple avec une requête HTTP directe à l'API Google
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/voices?key=${process.env.GOOGLE_TTS_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: 'Échec du test API',
          status: response.status,
          details: errorData 
        },
        { status: 500 }
      );
    }

    const data = await response.json() as GoogleVoicesResponse;
    const frenchVoices = data.voices?.filter((voice: GoogleVoice) => 
      voice.languageCodes?.includes('fr-FR')
    ) || [];

    return NextResponse.json({
      success: true,
      message: 'API Text-to-Speech configurée correctement !',
      frenchVoicesFound: frenchVoices.length,
      voices: frenchVoices.slice(0, 5).map((voice: GoogleVoice) => ({
        name: voice.name,
        gender: voice.ssmlGender,
        type: voice.name.includes('Wavenet') ? 'Premium' : 'Standard'
      }))
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Erreur de configuration',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}