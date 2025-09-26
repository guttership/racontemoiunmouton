// Formes organiques décoratives inspirées du design moderne
import React from 'react';

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
    {/* Fond neutre, aucune forme décorative */}
  </div>
);
