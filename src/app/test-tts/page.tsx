'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface VoiceStyle {
  key: string;
  name: string;
  voice: string;
  description: string;
}

export default function TtsTestPage() {
  const [styles, setStyles] = useState<VoiceStyle[]>([]);
  const [testText, setTestText] = useState("Il était une fois, dans un royaume lointain, une petite princesse qui aimait les histoires. Elle découvrit un jour un livre magique qui lui parlait avec différentes voix...");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Charger les styles disponibles
    fetch('/api/text-to-speech')
      .then(res => res.json())
      .then(data => {
        if (data.styles) {
          setStyles(data.styles);
        }
      })
      .catch(console.error);
  }, []);

  const testStyle = async (styleKey: string) => {
    setIsLoading(true);
    
    try {
      // Arrêter l'audio précédent
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }

      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: testText,
          style: styleKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur de génération audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      
      audio.onended = () => {
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play();
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération audio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
          <h1 className="text-3xl font-courgette text-center mb-6 text-gray-800">
            🎭 Test des styles de voix
          </h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte de test :
            </label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Entrez le texte à tester..."
            />
          </div>

          <div className="grid gap-4 md:gap-6">
            {styles.map((style) => (
              <div key={style.key} className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-gray-800 mb-1">
                      {style.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {style.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Voix: {style.voice}
                    </p>
                  </div>
                  <Button
                    onClick={() => testStyle(style.key)}
                    disabled={isLoading}
                    className="bg-[#ff7519] hover:bg-[#e6661a] text-white px-4 py-2 rounded-xl flex items-center gap-2 min-w-[100px]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Test...
                      </>
                    ) : (
                      <>
                        🎵 Tester
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {styles.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Chargement des styles...
            </div>
          )}

          <div className="mt-8 text-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-[#ff7519] hover:text-[#e6661a] font-medium"
            >
              ← Retour à l&apos;application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}