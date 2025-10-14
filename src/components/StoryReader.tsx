'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from '@/lib/i18n-provider';
import { Button } from '@/components/ui/button';

// Types de voix par langue
// Documentation: https://cloud.google.com/text-to-speech/docs/voices
const VOICE_CONFIG: Record<string, {
  female: { voice: string; name: string };
  male: { voice: string; name: string };
}> = {
  'fr': {
    female: { voice: 'fr-FR-Wavenet-C', name: 'Sophie' }, // Voix chaleureuse française
    male: { voice: 'fr-FR-Wavenet-D', name: 'Thomas' } // Voix expressive française
  },
  'en': {
    female: { voice: 'en-US-Wavenet-C', name: 'Female Voice' }, // Voix Wavenet US féminine
    male: { voice: 'en-US-Wavenet-D', name: 'Male Voice' } // Voix Wavenet US masculine
  },
  'es': {
    female: { voice: 'es-ES-Wavenet-C', name: 'Voz Femenina' }, // Voix Wavenet espagnole féminine
    male: { voice: 'es-ES-Wavenet-B', name: 'Voz Masculina' } // Voix Wavenet espagnole masculine
  },
  'de': {
    female: { voice: 'de-DE-Wavenet-C', name: 'Weibliche Stimme' }, // Voix Wavenet allemande féminine
    male: { voice: 'de-DE-Wavenet-D', name: 'Männliche Stimme' } // Voix Wavenet allemande masculine
  }
};

interface StoryReaderProps {
  story: string;
  className?: string;
}

export default function StoryReader({ story, className = '' }: StoryReaderProps) {
  const t = useTranslations('StoryReader');
  const locale = useLocale();
  
  console.log('📚 StoryReader reçu:', story?.length, 'caractères');
  console.log('📚 Contenu reçu:', story?.substring(0, 50));
  
  const [isLoading, setIsLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [narratorType, setNarratorType] = useState<'female' | 'male'>('female');
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

      const handleError = (e: Event) => {
        const audioElement = e.target as HTMLAudioElement;
        console.error('❌ Erreur lors de la lecture audio:', {
          error: audioElement.error,
          errorCode: audioElement.error?.code,
          errorMessage: audioElement.error?.message,
          src: audioElement.src
        });
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
    console.log('🚀 START generateAudio - Version:', new Date().toISOString());
    console.log('📊 Story length:', story?.length, 'chars');
    
    setIsLoading(true);
    try {
      console.log('🎤 Génération audio avec Google TTS...');
      console.log('🌍 Locale actuelle:', locale);
      console.log('🎭 Type narrateur:', narratorType);
      
      const voiceConfig = VOICE_CONFIG[locale] || VOICE_CONFIG['fr'];
      const selectedVoice = voiceConfig[narratorType].voice;
      
      console.log('🔊 Voix sélectionnée:', selectedVoice);
      console.log('📋 Configuration voix:', voiceConfig);
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: story,
          voice: selectedVoice,
          locale: locale, // Passer la locale au TTS
          speed: 0.75,        // Lecture ralentie de 25% pour un rythme vraiment posé
          pitch: 0.0,         // Pitch neutre pour plus de naturel
          volumeGainDb: -0.5  // Volume légèrement réduit pour un effet apaisant
        }),
      });

      console.log('📡 Réponse API:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('Content-Type'),
        url: response.url
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
      console.log('🎵 Blob audio reçu:', {
        size: audioBlob.size,
        type: audioBlob.type
      });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('🔗 URL blob créée:', audioUrl);
      
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
      console.error('❌ Erreur génération TTS:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur lors de la génération audio: ${errorMessage}\nVeuillez réessayer.`);
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
      <div className="bg-white dark:bg-[#2a2a29] rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none border border-gray-100 dark:border-[#3f3f3e] transition-colors duration-300">
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 dark:text-gray-100 font-clash-grotesk leading-relaxed text-base md:text-lg whitespace-pre-line">
            {story}
          </div>
        </div>
      </div>

      {/* Section audio */}
      <div className="bg-white dark:bg-[#2a2a29] rounded-2xl p-4 md:p-6 shadow-sm dark:shadow-none border border-gray-100 dark:border-[#3f3f3e] no-print transition-colors duration-300">
        <h3 className="text-lg md:text-xl font-courgette mb-4 text-center text-gray-800 dark:text-gray-100">
          {t('listen')}
        </h3>
        
        {/* Sélecteur de narrateur/narratrice */}
        <div className="text-center mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center justify-center gap-2">
            {t('narratorChoice')}
          </label>
          <div className="flex gap-3 justify-center max-w-md mx-auto">
            <button
              onClick={() => setNarratorType('male')}
              disabled={isReading || isLoading}
              className={`flex-1 px-4 py-3 rounded-2xl border-2 transition-all duration-200 ${
                narratorType === 'male'
                  ? 'border-[#ff7519] bg-[#ff7519]/10 dark:bg-[#ff7519]/20 shadow-md'
                  : 'border-gray-200 dark:border-[#3f3f3e] bg-white dark:bg-[#3f3f3e] hover:border-[#ff7519]/50 dark:hover:border-[#ff7519]/50'
              } ${isReading || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {t('narrator')}
              </div>
            </button>
            <button
              onClick={() => setNarratorType('female')}
              disabled={isReading || isLoading}
              className={`flex-1 px-4 py-3 rounded-2xl border-2 transition-all duration-200 ${
                narratorType === 'female'
                  ? 'border-[#ff7519] bg-[#ff7519]/10 dark:bg-[#ff7519]/20 shadow-md'
                  : 'border-gray-200 dark:border-[#3f3f3e] bg-white dark:bg-[#3f3f3e] hover:border-[#ff7519]/50 dark:hover:border-[#ff7519]/50'
              } ${isReading || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {t('narratorFemale')}
              </div>
            </button>
          </div>
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
                <span>{t('loading')}</span>
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
                <span>{t('pause')}</span>
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
                <span>{t('play')}</span>
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
              <span>{t('stop')}</span>
            </Button>
          )}
        </div>

        {/* Barre de progression */}
        {currentAudio && duration > 0 && (
          <div className="max-w-md mx-auto space-y-2 mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-300">
              <span>{formatTime(currentAudio.currentTime || 0)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-[#4a4a49] rounded-full h-2">
              <div 
                className="bg-[#ff7519] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Indications */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-300 max-w-md mx-auto space-y-1 mt-4">
          <p>
            <strong>Astuce :</strong> Utilisez des écouteurs pour une meilleure expérience
          </p>
          {!currentAudio && (
            <p className="text-orange-600 dark:text-[#ff7519]">
              L&apos;audio sera mis en cache après génération
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