'use client';

import { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';
import { transcribeAudio } from '@/lib/transcribeAudio.server';

interface VoiceInputRecorderProps {
  onTranscript: (text: string) => void;
  locale: string;
  isPremium?: boolean;
}

export function VoiceInputRecorder({ onTranscript, locale, isPremium = false }: VoiceInputRecorderProps) {
  const t = useTranslations('VoiceInput');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (!isPremium) {
      alert(t('premiumOnly'));
      return;
    }

    try {
      setError(null);
      
      console.log('🎤 Demande d\'accès au microphone...');
      
      // Demander l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      console.log('✅ Microphone accordé');
      
      // Créer le MediaRecorder avec le meilleur format disponible
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/ogg;codecs=opus';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ''; // Format par défaut
          }
        }
      }
      
      console.log('🎵 Format audio:', mimeType || 'default');
      
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        
        console.log('🔴 Enregistrement arrêté, traitement...');
        
        // Combiner les chunks en un seul blob
        const audioBlob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        
        console.log('📦 Taille audio:', audioBlob.size, 'bytes');
        
        // Convertir en base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          // Mapper la locale vers les codes de langue Google
          const langMap: Record<string, string> = {
            'fr': 'fr-FR',
            'en': 'en-US',
            'es': 'es-ES',
            'de': 'de-DE'
          };
          
          const languageCode = langMap[locale] || 'fr-FR';
          
          console.log('🌐 Transcription en cours...', languageCode);
          
          // Envoyer à l'API Google Cloud Speech-to-Text
          const result = await transcribeAudio(base64Audio, languageCode);
          
          setIsProcessing(false);
          
          if (result.success && result.transcript) {
            console.log('✅ Transcription:', result.transcript);
            onTranscript(result.transcript);
          } else {
            console.error('❌ Erreur transcription:', result.error);
            setError(result.error || t('recognitionFailed'));
          }
        };
        
        // Arrêter le stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      console.log('▶️ Enregistrement démarré');
      
      // Arrêt automatique après 60 secondes (1 minute)
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          console.log('⏱️ Arrêt automatique après 60s');
          mediaRecorderRef.current.stop();
        }
      }, 60000);
      
    } catch (err) {
      console.error('❌ Erreur microphone:', err);
      setError(t('microphoneDenied'));
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('🛑 Arrêt manuel de l\'enregistrement');
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing || !isPremium}
        variant={isRecording ? 'destructive' : 'default'}
        size="icon"
        className={`rounded-full transition-all duration-300 ${
          isRecording
            ? 'animate-pulse shadow-lg'
            : isProcessing
            ? 'cursor-wait'
            : 'shadow-md hover:shadow-lg'
        }`}
        title={
          isRecording 
            ? t('listening') 
            : isProcessing 
            ? 'Transcription...' 
            : t('clickToSpeak')
        }
      >
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isRecording ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
      
      {error && (
        <span className="text-xs text-red-500 font-medium max-w-[150px] text-right">
          {error}
        </span>
      )}
      
      {isRecording && (
        <span className="text-xs text-red-500 font-bold animate-pulse">
          🔴 {t('listening')}
        </span>
      )}
      
      {isProcessing && (
        <span className="text-xs text-blue-500 font-medium">
          ⏳ Transcription...
        </span>
      )}
    </div>
  );
}
