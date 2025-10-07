'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Types de voix simplifiés
const NARRATOR_TYPES = {
  female: {
    name: '👩 Conteuse',
    description: 'Une voix féminine chaleureuse',
    voice: 'fr-FR-Wavenet-C' // Sophie - Voix chaleureuse
  },
  male: {
    name: '👨 Conteur',
    description: 'Une voix masculine expressive',
    voice: 'fr-FR-Wavenet-D' // Thomas - Voix expressive
  }
};

interface StoryReaderProps {
  story: string;
  className?: string;
}

export default function StoryReader({ story, className = '' }: StoryReaderProps) {
  console.log('📚 StoryReader reçu:', story?.length, 'caractères');
  console.log('📚 Contenu reçu:', story?.substring(0, 50));
  
  const [isLoading, setIsLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [narratorType, setNarratorType] = useState<keyof typeof NARRATOR_TYPES>('female');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Nettoyer l'audio au démontage du composant
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  // Gestion des événements audio
  useEffect(() => {
    if (currentAudio) {
      const updateProgress = () => {
        if (currentAudio.duration && currentAudio.currentTime !== undefined) {
          const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;
          setProgress(progressPercent);
        }
      };

      const updateDuration = () => {
        if (currentAudio.duration) {
          setDuration(currentAudio.duration);
        }
      };

      const handleEnded = () => {
        setIsReading(false);
        setIsPaused(false);
        setProgress(0);
      };

      const handleError = () => {
        console.error('Erreur lors de la lecture audio');
        setIsReading(false);
        setIsLoading(false);
      };

      currentAudio.addEventListener('timeupdate', updateProgress);
      currentAudio.addEventListener('loadedmetadata', updateDuration);
      currentAudio.addEventListener('ended', handleEnded);
      currentAudio.addEventListener('error', handleError);

      return () => {
        currentAudio.removeEventListener('timeupdate', updateProgress);
        currentAudio.removeEventListener('loadedmetadata', updateDuration);
        currentAudio.removeEventListener('ended', handleEnded);
        currentAudio.removeEventListener('error', handleError);
      };
    }
  }, [currentAudio]);

  const generateAudio = async () => {
    setIsLoading(true);
    try {
      console.log('🎤 Génération audio avec Google TTS...');
      const selectedVoice = NARRATOR_TYPES[narratorType].voice;
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: story,
          voice: selectedVoice,
          autoAnalyze: true // On garde l'analyse automatique pour la prosodie
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur de génération';
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // JSON mal formé, garder le message par défaut
          }
        } else {
          errorMessage = `Erreur HTTP ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Nettoyer l'ancien audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }

      const newAudio = new Audio(audioUrl);
      newAudio.preload = 'auto';
      setCurrentAudio(newAudio);
      
      // Démarrer la lecture une fois l'audio chargé
      newAudio.oncanplaythrough = () => {
        setIsLoading(false);
        newAudio.play();
        setIsReading(true);
        setIsPaused(false);
      };

    } catch (error) {
      console.error('Erreur génération TTS:', error);
      alert('Erreur lors de la génération audio. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (currentAudio) {
      if (isReading && !isPaused) {
        // Pause
        currentAudio.pause();
        setIsPaused(true);
      } else if (isPaused) {
        // Reprendre
        currentAudio.play();
        setIsPaused(false);
      }
    } else {
      // Générer et lire
      generateAudio();
    }
  };

  const handleStop = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsReading(false);
      setIsPaused(false);
      setProgress(0);
    }
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Correction mobile : lecture audio doit être déclenchée par une interaction utilisateur
    if (currentAudio) {
      // Sur mobile, forcer le chargement et la lecture après interaction
      const playOnInteraction = () => {
        currentAudio.play().catch(() => {
          // Certains navigateurs mobiles bloquent l'autoplay, on ignore l'erreur
        });
        window.removeEventListener('touchend', playOnInteraction);
        window.removeEventListener('click', playOnInteraction);
      };
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        window.addEventListener('touchend', playOnInteraction);
        window.addEventListener('click', playOnInteraction);
      }
    }
  }, [currentAudio]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Affichage de l'histoire */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 font-clash-grotesk leading-relaxed text-base md:text-lg whitespace-pre-line">
            {story}
          </div>
        </div>
      </div>

      {/* Section audio */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 no-print">
        <h3 className="text-lg md:text-xl font-courgette mb-4 text-center text-gray-800">
          🎭 Écouter l&apos;histoire
        </h3>
        
        {/* Sélecteur de narrateur/narratrice */}
        <div className="text-center mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-center gap-2">
            <span className="text-[#ff7519] text-lg">🎭</span>
            Qui raconte l&apos;histoire ?
          </label>
          <div className="flex gap-3 justify-center max-w-md mx-auto">
            {Object.entries(NARRATOR_TYPES).map(([key, narrator]) => (
              <button
                key={key}
                onClick={() => setNarratorType(key as keyof typeof NARRATOR_TYPES)}
                disabled={isReading || isLoading}
                className={`flex-1 px-4 py-3 rounded-2xl border-2 transition-all duration-200 ${
                  narratorType === key
                    ? 'border-[#ff7519] bg-[#ff7519]/10 shadow-md'
                    : 'border-gray-200 bg-white hover:border-[#ff7519]/50'
                } ${isReading || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-3xl mb-1">{narrator.name.split(' ')[0]}</div>
                <div className="text-sm font-medium text-gray-700">
                  {narrator.name.split(' ')[1]}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {narrator.description}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
            <span className="animate-pulse">🤖</span>
            L&apos;IA adapte automatiquement le ton à l&apos;histoire
          </p>
        </div>

        {/* Contrôles audio */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={handlePlayPause}
            disabled={isLoading}
            className="hand-drawn-button hand-drawn-button-primary flex items-center gap-2 sm:gap-3 w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Génération...</span>
              </>
            ) : isReading && !isPaused ? (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M6 4h4v16H6V4zM14 4h4v16h-4V4z"
                    fill="currentColor"
                  />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M8 5v14l11-7L8 5z"
                    fill="currentColor"
                  />
                </svg>
                <span>{isPaused ? 'Reprendre' : 'Lire l\'histoire'}</span>
              </>
            )}
          </Button>
          
          {currentAudio && (
            <Button
              onClick={handleStop}
              className="hand-drawn-button hand-drawn-button-outline flex items-center gap-2 sm:gap-3 w-full sm:w-auto border-red-200 text-red-600 hover:border-red-400 hover:text-red-700"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6h12v12H6z"
                  fill="currentColor"
                />
              </svg>
              <span>Arrêter</span>
            </Button>
          )}
        </div>

        {/* Barre de progression */}
        {currentAudio && duration > 0 && (
          <div className="max-w-md mx-auto space-y-2 mt-4">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentAudio.currentTime || 0)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#ff7519] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Indications */}
        <div className="text-center text-xs text-gray-500 max-w-md mx-auto space-y-1 mt-4">
          <p>
            🎧 <strong>Astuce :</strong> Utilisez des écouteurs pour une meilleure expérience
          </p>
          {!currentAudio && (
            <p className="text-orange-600">
              💾 L&apos;audio sera mis en cache après génération
            </p>
          )}
        </div>
      </div>

      {/* Bouton Imprimer */}
      <div className="text-center">
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl shadow hover:bg-orange-600 print:hidden transition-colors duration-200"
          onClick={() => window.print()}
        >
          Imprimer ou sauvegarder l’histoire
        </button>
      </div>

      {/* Bouton Télécharger l'audio */}
      {currentAudio && (
        <div className="text-center">
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl shadow hover:bg-orange-600 transition-colors duration-200"
            onClick={() => {
              const url = currentAudio.src;
              const link = document.createElement('a');
              link.href = url;
              link.download = 'histoire.mp3';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
          T&eacute;l&eacute;charger l&apos;audio
          </button>
        </div>
      )}
    </div>
  );
}