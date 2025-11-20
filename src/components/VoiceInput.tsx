'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  locale: string;
  isPremium?: boolean;
}

export function VoiceInput({ onTranscript, locale, isPremium }: VoiceInputProps) {
  const t = useTranslations('VoiceInput');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Vérifier si le navigateur supporte Web Speech API
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
    
    // Diagnostics détaillés
    if (supported && typeof window !== 'undefined') {
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      console.log('[VoiceInput] Diagnostics:', {
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        isSecure,
        userAgent: navigator.userAgent,
        online: navigator.onLine
      });
      
      if (!isSecure) {
        console.warn('⚠️ Web Speech API nécessite HTTPS ou localhost');
      }
      if (!navigator.onLine) {
        console.warn('⚠️ Pas de connexion internet détectée');
      }
    }

    // Cleanup des timeouts
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const startRecognition = useCallback(() => {
    if (!isSupported || !isPremium) return;

    // Vérifier la connexion avant de démarrer
    if (!navigator.onLine) {
      setError('network-error');
      console.error('❌ Pas de connexion internet');
      return;
    }

    // Demander explicitement la permission microphone d'abord
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then((stream) => {
        // Fermer le stream, on a juste besoin de vérifier la permission
        stream.getTracks().forEach(track => track.stop());
        
        console.log('✅ Permission microphone accordée');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          console.error('❌ SpeechRecognition non disponible');
          setError('recognition-failed');
          return;
        }

        try {
          const recognition = new SpeechRecognition();

          // Configuration selon la locale
          const localeMap: Record<string, string> = {
            'fr': 'fr-FR',
            'en': 'en-US',
            'es': 'es-ES',
            'de': 'de-DE'
          };

          recognition.lang = localeMap[locale] || 'fr-FR';
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          console.log(`[VoiceInput] Démarrage reconnaissance (${recognition.lang})`);

          recognition.onstart = () => {
            console.log('✅ Reconnaissance démarrée');
            setIsListening(true);
          };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
      setError(null);
    };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        // Logger avec JSON.stringify pour éviter les problèmes de sérialisation
        try {
          console.error('❌ Event stringifié:', JSON.stringify(event));
        } catch {
          console.error('❌ Event non sérialisable');
        }
        
        // Logger chaque propriété individuellement
        console.error('Type:', typeof event);
        console.error('Keys:', Object.keys(event));
        console.error('Error value:', event.error);
        console.error('Message value:', event.message);
        console.error('Type value:', event.type);
        
        setIsListening(false);
        
        const errorType = event?.error;
        console.error('Error type final:', errorType);
        
        if (errorType === 'not-allowed') {
          setError('microphone-denied');
        } else if (errorType === 'no-speech') {
          setError('no-speech');
          setTimeout(() => setError(null), 2000);
        } else if (errorType === 'network') {
          setError('network-error');
        } else {
          setError('recognition-failed');
        }
      };

      recognition.onend = () => {
        console.log('🔚 Reconnaissance terminée');
        setIsListening(false);
      };

      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      } catch (error) {
        console.error('❌ Erreur lors de la création de la reconnaissance:', error);
        setError('recognition-failed');
        setIsListening(false);
      }
    })
    .catch((error) => {
      console.error('❌ Permission microphone refusée:', error);
      setError('microphone-denied');
      setIsListening(false);
    });
  }, [isSupported, isPremium, locale, onTranscript, isListening]);

  const handleVoiceInput = () => {
    if (!isSupported || !isPremium) return;

    // Annuler tout retry en cours
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Réinitialiser l'erreur à chaque nouvelle tentative manuelle
    setError(null);

    startRecognition();
  };

  if (!isPremium) {
    return null;
  }

  if (!isSupported) {
    return null;
  }

  // Déterminer le message du bouton selon l'état
  const getButtonTitle = () => {
    if (!isPremium) return t('premiumOnly');
    if (error === 'microphone-denied') return t('microphoneDenied');
    if (error === 'no-speech') return t('noSpeech');
    if (error === 'network-error') return t('networkError');
    if (error === 'recognition-failed') return t('recognitionFailed');
    if (isListening) return t('listening');
    return t('clickToSpeak');
  };

  return (
    <Button
      type="button"
      onClick={handleVoiceInput}
      disabled={!isPremium}
      variant={error ? "destructive" : "outline"}
      size="sm"
      className={`rounded-xl transition-all ${
        isListening
          ? 'bg-red-500 text-white border-red-600 animate-pulse'
          : error
          ? 'opacity-70'
          : 'bg-white dark:bg-[#2a2a29] border-gray-300 dark:border-[#3f3f3e] hover:bg-gray-50 dark:hover:bg-[#3f3f3e]'
      }`}
      title={getButtonTitle()}
    >
      {isListening ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  );
}
