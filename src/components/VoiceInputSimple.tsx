'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';

interface VoiceInputSimpleProps {
  onTranscript: (text: string) => void;
  locale: string;
  isPremium?: boolean;
}

export function VoiceInputSimple({ onTranscript, locale, isPremium = false }: VoiceInputSimpleProps) {
  const t = useTranslations('VoiceInput');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Vérifier la compatibilité et initialiser l'instance UNE SEULE FOIS
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        setError(t('recognitionFailed'));
        return;
      }

      const recognition = new SpeechRecognition();
      
      // Mapper la locale vers les codes de langue supportés
      const langMap: Record<string, string> = {
        'fr': 'fr-FR',
        'en': 'en-US',
        'es': 'es-ES',
        'de': 'de-DE'
      };
      
      recognition.lang = langMap[locale] || 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('✅ Reconnaissance démarrée');
        setIsListening(true);
        setError(null);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('✅ Transcription:', transcript);
        onTranscript(transcript);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        console.error('❌ Erreur reconnaissance:', event.error);
        setIsListening(false);
        
        // Ignorer les erreurs mineures
        if (['no-speech', 'aborted'].includes(event.error)) {
          console.log('⚠️ Erreur mineure ignorée:', event.error);
          return;
        }
        
        // Erreur réseau : message spécifique mais pas d'alerte
        if (event.error === 'network') {
          setError(t('networkError'));
          return;
        }
        
        // Autres erreurs importantes
        const errorMessages: Record<string, string> = {
          'audio-capture': t('microphoneDenied'),
          'not-allowed': t('microphoneDenied'),
          'service-not-allowed': t('recognitionFailed'),
        };
        
        setError(errorMessages[event.error] || t('recognitionFailed'));
      };

      recognition.onend = () => {
        console.log('🔴 Reconnaissance terminée');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [locale, onTranscript, t]);

  const toggleListening = () => {
    if (!isPremium) {
      alert(t('premiumOnly'));
      return;
    }

    if (!recognitionRef.current) {
      console.error('❌ Recognition ref non initialisé');
      return;
    }

    if (isListening) {
      console.log('🛑 Arrêt de la reconnaissance');
      recognitionRef.current.stop();
    } else {
      setError(null);
      try {
        console.log('▶️ Démarrage de la reconnaissance');
        recognitionRef.current.start();
      } catch (err) {
        console.error('❌ Erreur au démarrage:', err);
        setError(t('recognitionFailed'));
      }
    }
  };

  if (!isSupported) {
    return null; // Masquer le bouton si non supporté
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        onClick={toggleListening}
        disabled={!isPremium}
        variant={isListening ? 'destructive' : 'default'}
        size="icon"
        className={`rounded-full transition-all duration-300 ${
          isListening ? 'animate-pulse shadow-lg' : 'shadow-md hover:shadow-lg'
        }`}
        title={isListening ? t('listening') : t('clickToSpeak')}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      
      {error && error !== t('networkError') && (
        <span className="text-xs text-red-500 font-medium">
          {error}
        </span>
      )}
      
      {isListening && (
        <span className="text-xs text-blue-500 font-medium animate-pulse">
          🎤 {t('listening')}
        </span>
      )}
    </div>
  );
}
