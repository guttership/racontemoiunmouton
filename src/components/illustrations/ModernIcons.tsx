// Composants d'illustrations SVG inspirés du design moderne
import React from 'react';

// Illustration principale - Mouton stylisé avec formes organiques
export const SheepIllustration = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    {/* Forme organique orange arrière */}
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6600" stopOpacity="1"/>
          <stop offset="100%" stopColor="#FF6600" stopOpacity="1"/>
        </linearGradient>
      </defs>
      <path 
        d="M50,120 C30,100 40,60 80,50 C120,40 160,60 170,100 C180,140 150,170 110,160 C70,150 50,120 50,120 Z" 
        fill="url(#orangeGradient)" 
      />
    </svg>
    
    {/* Personnage mouton minimaliste */}
    <svg viewBox="0 0 120 120" className="relative z-10 w-full h-full">
      {/* Corps du mouton */}
      <ellipse cx="60" cy="70" rx="25" ry="20" fill="#1A1A1A" opacity="1"/>
      <ellipse cx="60" cy="68" rx="25" ry="20" fill="white"/>
      
      {/* Tête */}
      <circle cx="60" cy="45" r="15" fill="white"/>
      
      {/* Yeux */}
      <circle cx="55" cy="42" r="2" fill="#1A1A1A"/>
      <circle cx="65" cy="42" r="2" fill="#1A1A1A"/>
      
      {/* Sourire */}
      <path d="M 55 48 Q 60 52 65 48" stroke="#1A1A1A" strokeWidth="2" fill="none"/>
      
      {/* Oreilles */}
      <ellipse cx="50" cy="38" rx="4" ry="6" fill="white"/>
      <ellipse cx="70" cy="38" rx="4" ry="6" fill="white"/>
      
      {/* Pattes */}
      <rect x="48" y="85" width="6" height="12" fill="#1A1A1A" rx="3"/>
      <rect x="58" y="85" width="6" height="12" fill="#1A1A1A" rx="3"/>
      <rect x="68" y="85" width="6" height="12" fill="#1A1A1A" rx="3"/>
    </svg>
  </div>
);

// Illustration pour les personnages
export const CharacterIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Forme organique orange */}
      <circle cx="50" cy="50" r="35" fill="#FF6600" opacity="1"/>
      
      {/* Personnage stylisé */}
      <circle cx="50" cy="35" r="12" fill="white"/>
      <ellipse cx="50" cy="65" rx="15" ry="18" fill="white"/>
      
      {/* Visage */}
      <circle cx="46" cy="32" r="1.5" fill="#1A1A1A"/>
      <circle cx="54" cy="32" r="1.5" fill="#1A1A1A"/>
      <path d="M 46 38 Q 50 41 54 38" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
    </svg>
  </div>
);

// Illustration pour l'environnement
export const EnvironmentIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Forme organique orange */}
      <path 
        d="M20,70 C15,50 25,30 50,25 C75,30 85,50 80,70 C75,85 55,90 50,85 C45,90 25,85 20,70 Z" 
        fill="#FF6600" 
        opacity="1"
      />
      
      {/* Éléments d'environnement */}
      <circle cx="35" cy="45" r="8" fill="white"/>
      <circle cx="65" cy="45" r="8" fill="white"/>
      <rect x="45" y="55" width="10" height="20" fill="white"/>
      
      {/* Détails minimalistes */}
      <circle cx="35" cy="45" r="3" fill="#1A1A1A" opacity="1"/>
      <circle cx="65" cy="45" r="3" fill="#1A1A1A" opacity="1"/>
    </svg>
  </div>
);

// Illustration pour le profil enfant
export const ChildIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Forme organique orange */}
      <ellipse cx="50" cy="55" rx="30" ry="35" fill="#FF6600" opacity="1"/>
      
      {/* Enfant stylisé */}
      <circle cx="50" cy="40" r="15" fill="white"/>
      <ellipse cx="50" cy="70" rx="12" ry="15" fill="white"/>
      
      {/* Visage souriant */}
      <circle cx="45" cy="37" r="2" fill="#1A1A1A"/>
      <circle cx="55" cy="37" r="2" fill="#1A1A1A"/>
      <path d="M 42 44 Q 50 50 58 44" stroke="#1A1A1A" strokeWidth="2" fill="none"/>
      
      {/* Cheveux stylisés */}
      <path d="M 38 32 Q 50 28 62 32" stroke="#1A1A1A" strokeWidth="3" fill="none"/>
    </svg>
  </div>
);

// Illustration pour la lecture audio
export const AudioIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Forme organique orange */}
      <circle cx="50" cy="50" r="35" fill="#FF5722" opacity="1"/>
      
      {/* Microphone stylisé */}
      <ellipse cx="50" cy="45" rx="8" ry="12" fill="white"/>
      <rect x="46" y="57" width="8" height="15" fill="white"/>
      <rect x="40" y="70" width="20" height="3" fill="#1A1A1A"/>
      
      {/* Ondes sonores */}
      <path d="M 68 40 Q 72 45 68 50" stroke="#1A1A1A" strokeWidth="2" fill="none"/>
      <path d="M 75 35 Q 82 45 75 55" stroke="#1A1A1A" strokeWidth="2" fill="none"/>
      <path d="M 32 40 Q 28 45 32 50" stroke="#1A1A1A" strokeWidth="2" fill="none"/>
      <path d="M 25 35 Q 18 45 25 55" stroke="#1A1A1A" strokeWidth="2" fill="none"/>
    </svg>
  </div>
);

// Illustration pour la génération d'histoire
export const StoryIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Forme organique orange */}
      <path 
        d="M25,60 C20,40 30,20 50,20 C70,20 80,40 75,60 C70,80 50,85 50,80 C50,85 30,80 25,60 Z" 
        fill="#FF5722" 
        opacity="1"
      />
      
      {/* Livre ouvert */}
      <path d="M 30 45 L 50 40 L 70 45 L 70 70 L 50 65 L 30 70 Z" fill="white" stroke="#1A1A1A" strokeWidth="2"/>
      <line x1="50" y1="40" x2="50" y2="65" stroke="#1A1A1A" strokeWidth="2"/>
      
      {/* Lignes de texte */}
      <line x1="35" y1="50" x2="45" y2="48" stroke="#1A1A1A" strokeWidth="1"/>
      <line x1="35" y1="55" x2="45" y2="53" stroke="#1A1A1A" strokeWidth="1"/>
      <line x1="55" y1="48" x2="65" y2="50" stroke="#1A1A1A" strokeWidth="1"/>
      <line x1="55" y1="53" x2="65" y2="55" stroke="#1A1A1A" strokeWidth="1"/>
      
      {/* Étoiles magiques */}
      <circle cx="75" cy="30" r="2" fill="#FF5722"/>
      <circle cx="25" cy="35" r="1.5" fill="#FF5722"/>
      <circle cx="80" cy="75" r="1" fill="#FF5722"/>
    </svg>
  </div>
);
