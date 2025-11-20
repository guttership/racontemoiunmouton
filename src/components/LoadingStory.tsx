'use client';

import React, { useState, useEffect } from 'react';
import { ModernBackground } from '@/components/illustrations/OrganicShapes';

const LOADING_MESSAGES = [
  "Les moutons rassemblent leurs meilleures idées...",
  "La magie opère, patience mon petit...",
  "Je feuillette mon grand livre d'histoires...", 
  "Les étoiles chuchotent des secrets merveilleux...",
  "Les personnages répètent leur scène...",
  "Je construis un château magique...",
  "Les fées préparent leurs baguettes...",
  "Je mélange les couleurs de l'arc-en-ciel...",
  "Le spectacle se prépare en coulisses...",
  "Je capture un peu de poussière d'étoiles...",
  "Je peins le décor de ton aventure...",
  "J'accorde les instruments des musiciens magiques..."
];

export default function LoadingStory() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Changer de message toutes les 2.5 secondes
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    // Animation des points toutes les 500ms
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 relative flex items-center justify-center">
      <ModernBackground />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {/* Animation de chargement avec mouton */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Animation de chargement */}
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 animate-bounce">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 animate-pulse"></div>
            </div>
            
            {/* Cercles de chargement */}
            <div className="absolute -inset-4 opacity-20">
              <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-[#ff7519] rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div className="absolute -inset-2 opacity-30">
              <div className="w-28 h-28 md:w-36 md:h-36 border-2 border-[#ff7519] rounded-full animate-spin border-r-transparent" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
            </div>
          </div>
        </div>

        {/* Message de chargement */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-2xl md:text-3xl font-courgette mb-4 text-gray-800">
            Création en cours{dots}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 font-clash-grotesk min-h-[60px] flex items-center justify-center">
            {LOADING_MESSAGES[messageIndex]}
          </p>
          
          {/* Barre de progression animée */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#ff7519] to-orange-400 rounded-full animate-pulse" 
                   style={{ 
                     width: '100%', 
                     animation: 'progress 3s ease-in-out infinite' 
                   }}>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 font-clash-grotesk">
          ⏳ Cela peut prendre quelques instants pour créer une histoire parfaite...
        </p>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 10%; opacity: 0.5; }
          50% { width: 80%; opacity: 1; }
          100% { width: 100%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
