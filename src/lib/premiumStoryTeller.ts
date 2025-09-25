// Service de synthèse vocale avec OpenAI TTS - Qualité premium
export class PremiumStoryTeller {
  private currentAudio: HTMLAudioElement | null = null;
  private isReading = false;
  private isPaused = false;

  // Voix OpenAI disponibles pour les histoires
  private readonly voices = {
    'alloy': 'Alloy - Voix neutre et douce',
    'echo': 'Echo - Voix masculine calme',
    'fable': 'Fable - Voix britannique expressive',
    'onyx': 'Onyx - Voix profonde et apaisante',
    'nova': 'Nova - Voix féminine chaleureuse',
    'shimmer': 'Shimmer - Voix douce et mélodieuse'
  };

  public async generateSpeech(text: string, voice: string = 'nova'): Promise<Blob> {
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: this.preprocessStoryText(text),
        voice: voice,
        model: 'tts-1-hd' // Modèle haute définition
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur TTS: ${response.status}`);
    }

    return await response.blob();
  }

  private preprocessStoryText(text: string): string {
    return text
      // Nettoyer le texte
      .replace(/\s+/g, ' ')
      .trim()
      // Ajouter des pauses naturelles avec la ponctuation
      .replace(/\. /g, '. ')
      .replace(/! /g, '! ')
      .replace(/\? /g, '? ')
      // Améliorer l'expressivité pour les histoires
      .replace(/(Il était une fois)/gi, '$1...')
      .replace(/(Soudain|Tout à coup)/gi, '$1,')
      .replace(/(Et ils vécurent heureux)/gi, '$1...');
  }

  public async readStory(story: string, voice: string = 'nova'): Promise<void> {
    try {
      // Arrêter toute lecture en cours
      this.stopReading();

      console.log('🎭 Génération de l\'audio avec OpenAI TTS...');
      
      // Générer l'audio avec OpenAI
      const audioBlob = await this.generateSpeech(story, voice);
      
      // Créer un URL pour l'audio
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Créer l'élément audio
      this.currentAudio = new Audio(audioUrl);
      
      // Configuration de l'audio
      this.currentAudio.preload = 'auto';
      
      // Gestion des événements
      this.currentAudio.onloadstart = () => {
        console.log('📡 Chargement de l\'audio...');
      };

      this.currentAudio.oncanplay = () => {
        console.log('✅ Audio prêt à être lu');
      };

      this.currentAudio.onplay = () => {
        this.isReading = true;
        this.isPaused = false;
        console.log('🎤 Début de la lecture premium');
      };

      this.currentAudio.onpause = () => {
        this.isPaused = true;
        console.log('⏸️ Lecture en pause');
      };

      this.currentAudio.onended = () => {
        this.isReading = false;
        this.isPaused = false;
        URL.revokeObjectURL(audioUrl); // Nettoyer l'URL
        console.log('🏁 Fin de l\'histoire');
      };

      this.currentAudio.onerror = (error) => {
        this.isReading = false;
        this.isPaused = false;
        console.error('❌ Erreur audio:', error);
        URL.revokeObjectURL(audioUrl);
      };

      // Démarrer la lecture
      await this.currentAudio.play();
      
    } catch (error) {
      this.isReading = false;
      console.error('❌ Erreur lors de la génération audio:', error);
      throw error;
    }
  }

  public stopReading(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isReading = false;
    this.isPaused = false;
  }

  public pauseReading(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
    }
  }

  public resumeReading(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play();
    }
  }

  public isCurrentlyReading(): boolean {
    return !!this.isReading && !!this.currentAudio && !this.currentAudio?.paused;
  }

  public isPausedReading(): boolean {
    return this.isPaused;
  }

  public getAvailableVoices(): {[key: string]: string} {
    return this.voices;
  }

  public getCurrentTime(): number {
    return this.currentAudio?.currentTime || 0;
  }

  public getDuration(): number {
    return this.currentAudio?.duration || 0;
  }

  public setCurrentTime(time: number): void {
    if (this.currentAudio) {
      this.currentAudio.currentTime = time;
    }
  }
}

// Instance singleton
export const premiumStoryTeller = new PremiumStoryTeller();
