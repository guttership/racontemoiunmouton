// Service de synthèse vocale optimisée pour les histoires pour enfants
export class StoryTeller {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isReading = false;
  private voices: SpeechSynthesisVoice[] = [];
  private bestVoice: SpeechSynthesisVoice | null = null;
  private paragraphs: string[] = [];
  private currentParagraphIndex = 0;
  private readByParagraphs = true; // Nouvelle option pour lire par paragraphes

  constructor() {
    this.initializeVoices();
  }

  private initializeVoices() {
    // Attendre que les voix soient chargées
    const loadVoices = () => {
      this.voices = speechSynthesis.getVoices();
      this.bestVoice = this.findBestFrenchVoice();
    };

    // Charger immédiatement si disponible
    loadVoices();

    // Écouter l'événement de chargement des voix (nécessaire sur certains navigateurs)
    if (speechSynthesis.addEventListener) {
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }
  }

  private findBestFrenchVoice(): SpeechSynthesisVoice | null {
    // Ordre de préférence pour les voix françaises
    const preferredVoices = [
      // Voix premium françaises
      'Google français',
      'Microsoft Hortense - French (France)',
      'Microsoft Paul - French (France)',
      'Amélie',
      'Thomas',
      'Marie',
      // Voix système françaises
      'fr-FR',
      'fr_FR',
      'French (France)',
      'français',
      'Français'
    ];

    // Chercher la meilleure voix disponible
    for (const preferredName of preferredVoices) {
      const voice = this.voices.find(v => 
        v.name.includes(preferredName) || 
        v.lang.startsWith('fr')
      );
      if (voice) return voice;
    }

    // Fallback: première voix française trouvée
    return this.voices.find(v => v.lang.startsWith('fr')) || null;
  }

  private preprocessStoryText(text: string): string {
    return text
      // Nettoyer le texte et améliorer la lisibilité
      .replace(/\s+/g, ' ') // Normaliser les espaces
      .replace(/\n{3,}/g, '\n\n') // Limiter les sauts de ligne multiples
      .trim();
  }

  private readNextParagraph(): void {
    if (this.currentParagraphIndex >= this.paragraphs.length) {
      // Fin de l'histoire
      this.isReading = false;
      this.currentUtterance = null;
      this.currentParagraphIndex = 0;
      console.log('✅ Fin de la lecture de l\'histoire complète');
      return;
    }

    const paragraph = this.paragraphs[this.currentParagraphIndex].trim();
    if (!paragraph) {
      // Paragraphe vide, passer au suivant
      this.currentParagraphIndex++;
      setTimeout(() => this.readNextParagraph(), 500); // Pause de 500ms
      return;
    }

    const utterance = new SpeechSynthesisUtterance(paragraph);
    
    // Configurer la voix et les paramètres
    if (this.bestVoice) {
      utterance.voice = this.bestVoice;
    }
    
    utterance.lang = 'fr-FR';
    utterance.rate = 0.8;
    utterance.pitch = 1.05;
    utterance.volume = 0.95;

    utterance.onend = () => {
      this.currentParagraphIndex++;
      // Pause de 800ms entre les paragraphes pour une lecture plus naturelle
      setTimeout(() => {
        if (this.isReading) { // Vérifier si la lecture n'a pas été arrêtée
          this.readNextParagraph();
        }
      }, 800);
    };

    utterance.onerror = (event) => {
      console.error('❌ Erreur lors de la lecture du paragraphe:', event.error);
      this.currentParagraphIndex++;
      // Continuer avec le paragraphe suivant même en cas d'erreur
      setTimeout(() => {
        if (this.isReading) {
          this.readNextParagraph();
        }
      }, 500);
    };

    this.currentUtterance = utterance;
    speechSynthesis.speak(utterance);
  }

  public async readStory(story: string): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('La synthèse vocale n\'est pas supportée par ce navigateur');
    }

    // Arrêter toute lecture en cours
    this.stopReading();

    // Attendre que les voix soient chargées
    if (this.voices.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.initializeVoices();
    }

    // Nettoyer et préparer le texte
    const cleanText = this.preprocessStoryText(story);
    
    if (this.readByParagraphs) {
      // Diviser l'histoire en paragraphes
      this.paragraphs = cleanText
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);
      
      this.currentParagraphIndex = 0;
      this.isReading = true;
      
      console.log('Début de la lecture par paragraphes (' + this.paragraphs.length + ' paragraphes)');
      this.readNextParagraph();
    } else {
      // Lecture continue (ancienne méthode)
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      if (this.bestVoice) {
        utterance.voice = this.bestVoice;
      }
      
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      utterance.pitch = 1.05;
      utterance.volume = 0.95;

      utterance.onstart = () => {
        this.isReading = true;
        console.log('Début de la lecture continue');
      };

      utterance.onend = () => {
        this.isReading = false;
        this.currentUtterance = null;
        console.log('✅ Fin de la lecture de l\'histoire');
      };

      utterance.onerror = (event) => {
        this.isReading = false;
        this.currentUtterance = null;
        console.error('❌ Erreur lors de la lecture:', event.error);
      };

      this.currentUtterance = utterance;
      speechSynthesis.speak(utterance);
    }
  }

  public stopReading(): void {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    this.isReading = false;
    this.currentUtterance = null;
    this.currentParagraphIndex = 0; // Réinitialiser l'index des paragraphes
  }

  public pauseReading(): void {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    }
  }

  public resumeReading(): void {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  }

  public isCurrentlyReading(): boolean {
    return this.isReading && speechSynthesis.speaking;
  }

  public isPaused(): boolean {
    return speechSynthesis.paused;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => voice.lang.startsWith('fr'));
  }

  public setVoice(voice: SpeechSynthesisVoice): void {
    this.bestVoice = voice;
  }
}

// Instance singleton
export const storyTeller = new StoryTeller();
