'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Voix disponibles (définition côté client pour éviter l'import du SDK)
const GOOGLE_FRENCH_VOICES = {
  'fr-FR-Standard-A': 'Claire - Voix féminine standard',
  'fr-FR-Standard-B': 'Henri - Voix masculine standard', 
  'fr-FR-Standard-C': 'Amélie - Voix féminine douce',
  'fr-FR-Standard-D': 'Paul - Voix masculine grave',
  'fr-FR-Wavenet-A': 'Léa - Voix féminine naturelle',
  'fr-FR-Wavenet-B': 'Marc - Voix masculine naturelle',
  'fr-FR-Wavenet-C': 'Sophie - Voix chaleureuse',
  'fr-FR-Wavenet-D': 'Thomas - Voix expressive',
  'fr-FR-Neural2-A': 'Emma - Voix moderne féminine',
  'fr-FR-Neural2-B': 'Louis - Voix moderne masculine',
};

// Styles de voix prédéfinis
const VOICE_STYLES = {
  auto: { name: '🤖 Analyse automatique', description: 'L\'IA choisit le ton selon l\'histoire' },
  gentle: { name: '🌙 Doux et apaisant', description: 'Parfait pour l\'heure du coucher' },
  animated: { name: '🎭 Animé et expressif', description: 'Plein de vie et d\'énergie' },
  storyteller: { name: '📚 Conteur traditionnel', description: 'Comme les anciens contes' },
  motherly: { name: '🤱 Maternel et chaleureux', description: 'Doux comme une maman' },
  playful: { name: '🎈 Ludique et enjoué', description: 'Amusant et joyeux' },
  funny: { name: '😂 Drôle et rigolo', description: 'Pour les histoires amusantes' },
  mysterious: { name: '🕵️ Mystérieux et intriguant', description: 'Pour les mystères et secrets' },
  adventurous: { name: '⚔️ Aventureux et courageux', description: 'Pour les quêtes héroïques' },
  magical: { name: '✨ Magique et merveilleux', description: 'Pour la magie et les fées' },
  scary_light: { name: '👻 Un peu effrayant', description: 'Suspense adapté aux enfants' }
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
  const [selectedVoice, setSelectedVoice] = useState('fr-FR-Wavenet-C');
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof VOICE_STYLES>('auto');
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
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: story,
          ...(selectedStyle === 'auto' 
            ? { autoAnalyze: true } 
            : { style: selectedStyle }
          )
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

  const voiceEntries = Object.entries(GOOGLE_FRENCH_VOICES);

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
        
        {/* Sélecteur de style de voix */}
        <div className="text-center mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-center gap-2">
            <span className="text-[#ff7519] text-lg">🎭</span>
            Style de narration
          </label>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value as keyof typeof VOICE_STYLES)}
            className="hand-drawn-input text-sm px-3 py-2 max-w-xs mx-auto"
            disabled={isReading || isLoading}
          >
            {Object.entries(VOICE_STYLES).map(([key, style]) => (
              <option key={key} value={key}>
                {style.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            {selectedStyle === 'auto' ? (
              <span className="flex items-center justify-center gap-1">
                <span className="animate-pulse">🤖</span>
                L&apos;IA analyse l&apos;histoire pour adapter le ton
              </span>
            ) : (
              VOICE_STYLES[selectedStyle].description
            )}
          </p>
        </div>
        
        {/* Sélecteur de voix - masqué car intégré dans les styles */}
        <div className="hidden">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#ff7519]"
            >
              <path
                d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"
                fill="currentColor"
              />
            </svg>
            Choisir la voix du conteur
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="hand-drawn-input text-sm px-3 py-2 max-w-xs mx-auto"
            disabled={isReading || isLoading}
          >
            {voiceEntries.map(([key, description]) => (
              <option key={key} value={key}>
                {description}
              </option>
            ))}
          </select>
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
          Imprimer l’histoire
        </button>
      </div>
    </div>
  );
}