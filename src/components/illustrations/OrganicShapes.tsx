// Formes organiques décoratives inspirées du design moderne
import React from 'react';

// Grande forme organique orange pour l'arrière-plan
export const OrganicShape1 = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 300 400" className={`absolute ${className}`} style={{ zIndex: -1 }}>
    <defs>
      <linearGradient id="organicGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5722" stopOpacity="1"/>
        <stop offset="50%" stopColor="#FF8A65" stopOpacity="1"/>
        <stop offset="100%" stopColor="#FFAB91" stopOpacity="1"/>
      </linearGradient>
    </defs>
    <path 
      d="M80,50 C120,30 180,60 220,120 C260,180 240,250 200,300 C160,350 100,340 60,290 C20,240 10,180 30,130 C50,80 60,70 80,50 Z" 
      fill="url(#organicGradient1)" 
    />
  </svg>
);

// Forme organique moyenne
export const OrganicShape2 = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 250" className={`absolute ${className}`} style={{ zIndex: -1 }}>
    <defs>
      <radialGradient id="organicGradient2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FF5722" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#FF5722" stopOpacity="0.05"/>
      </radialGradient>
    </defs>
    <path 
      d="M60,40 C90,25 130,45 150,80 C170,115 160,155 130,180 C100,205 70,195 50,165 C30,135 25,105 35,75 C45,45 50,40 60,40 Z" 
      fill="url(#organicGradient2)" 
    />
  </svg>
);

// Petite forme organique d'accent
export const OrganicShape3 = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 150 150" className={`absolute ${className}`} style={{ zIndex: -1 }}>
    <circle 
      cx="75" 
      cy="75" 
      r="60" 
      fill="#FF5722" 
      opacity="0.08"
      transform="scale(1.2, 0.8) rotate(15 75 75)"
    />
  </svg>
);

// Forme abstraite inspirée de l'image
export const AbstractShape = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 250 300" className={`absolute ${className}`} style={{ zIndex: -1 }}>
    <defs>
      <linearGradient id="abstractGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5722" stopOpacity="0.12"/>
        <stop offset="100%" stopColor="#FFA726" stopOpacity="0.08"/>
      </linearGradient>
    </defs>
    <path 
      d="M70,60 C110,40 160,70 180,120 C200,170 190,220 150,250 C110,280 70,270 40,230 C10,190 20,140 35,100 C50,60 60,50 70,60 Z" 
      fill="url(#abstractGradient)" 
    />
    {/* Petite forme interne */}
    <ellipse 
      cx="120" 
      cy="150" 
      rx="25" 
      ry="35" 
      fill="#FF5722" 
      opacity="0.15"
      transform="rotate(25 120 150)"
    />
  </svg>
);

// Élément décoratif flottant
export const FloatingElement = ({ className = "" }: { className?: string }) => (
  <div className={`absolute ${className}`} style={{ zIndex: -1 }}>
    <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24">
      <circle cx="50" cy="50" r="30" fill="#FF5722" opacity="0.1"/>
      <circle cx="50" cy="50" r="15" fill="#FF5722" opacity="0.2"/>
      <circle cx="50" cy="50" r="5" fill="#FF5722" opacity="0.3"/>
    </svg>
  </div>
);

// Points décoratifs dispersés
export const ScatteredDots = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 ${className}`} style={{ zIndex: -1 }}>
    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white0 rounded-full opacity-30"></div>
    <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full opacity-20" style={{ backgroundColor: '#ff7519' }}></div>
    <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full opacity-40" style={{ backgroundColor: '#ff7519' }}></div>
    <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white0 rounded-full opacity-25"></div>
    <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-white0 rounded-full opacity-35"></div>
    <div className="absolute top-1/6 right-1/6 w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: '#ff7519' }}></div>
  </div>
);

// Composition d'arrière-plan complet
export const ModernBackground = ({ className = "" }: { className?: string }) => (
  <div className={`fixed inset-0 ${className}`} style={{ zIndex: -10 }}>
    {/* Grandes formes organiques */}
    <OrganicShape1 className="top-0 right-0 transform rotate-12" />
    <OrganicShape2 className="bottom-0 left-0 transform -rotate-12" />
    <AbstractShape className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
    
    {/* Éléments flottants */}
    <FloatingElement className="top-1/4 left-1/4 animate-pulse" />
    <FloatingElement className="bottom-1/4 right-1/4 animate-pulse delay-1000" />
    <FloatingElement className="top-3/4 left-3/4 animate-pulse delay-500" />
    
    {/* Points dispersés */}
    <ScatteredDots />
    
    {/* Gradient overlay subtil */}
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-orange-50/10 to-transparent"></div>
  </div>
);
