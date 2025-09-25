'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import StoryCreationSlider from '@/components/StoryCreationSlider';
import StoryReader from '@/components/StoryReader';
import LoadingStory from '@/components/LoadingStory';
import { Button } from '@/components/ui/button';
import { StorySettings, ChildProfile } from '@/types/story';
import { ModernBackground } from '@/components/illustrations/OrganicShapes';
import { StoryIcon } from '@/components/illustrations/ModernIcons';

export default function Home() {
  const [storySettings, setStorySettings] = useState<StorySettings>({
    characters: [],
    characterCount: 1,
    environment: '',
  });
  
  const [childProfile, setChildProfile] = useState<ChildProfile>({
    name: '',
    age: 3,
    interests: [],
    personality: [],
    favoriteThings: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string>('');

  const generateStory = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...storySettings,
          childProfile,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedStory(data.story);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  // Vue de l'état de génération
  if (isGenerating) {
    return <LoadingStory />;
  }

  // Vue de l'histoire générée
  if (generatedStory) {
    return (
      <div className="min-h-screen bg-gray-100 relative">
        <ModernBackground />
        
        <div className="relative max-w-5xl mx-auto p-4 z-10">
          <div className="bg-white rounded-3xl p-6 md:p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3 md:gap-4">
                <StoryIcon className="w-12 h-12 md:w-16 md:h-16" />
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-courgette">
                    Votre histoire magique
                  </h1>
                  <p className="text-gray-600 mt-1 font-clash-grotesk text-sm md:text-base">
                    Une création unique pour votre enfant
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setGeneratedStory('')}
                className="bg-gray-100 text-gray-800 px-4 md:px-6 py-2 md:py-3 rounded-2xl font-clash-grotesk font-semibold text-sm md:text-base"
              >
                📝 Nouvelle histoire
              </Button>
            </div>
          </div>
          
          <StoryReader story={generatedStory} />
        </div>
      </div>
    );
  }

  console.log('🏠 Affichage de la page principale');

  // Vue principale avec le slider
  return (
    <div className="min-h-screen bg-gray-100 relative">
      <ModernBackground />
      
      {/* Header */}
      <header className="relative text-center py-8 md:py-16 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-4 md:mb-6">
            <Image
              src="/logo_mouton.svg"
              alt="Logo Raconte-moi un mouton"
              width={120}
              height={120}
              className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-courgette mb-4 md:mb-6 leading-tight">
            Raconte-moi un mouton
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto font-clash-grotesk">
            Créez une histoire magique et personnalisée pour le coucher de votre enfant
          </p>
        </div>
      </header>

      {/* Contenu principal avec slider */}
      <main className="relative mx-auto px-2 md:px-4 pb-10 md:pb-20 z-10">
        <StoryCreationSlider
          selectedCharacters={storySettings.characters}
          characterCount={storySettings.characterCount}
          selectedEnvironment={storySettings.environment}
          childProfile={childProfile}
          isGenerating={isGenerating}
          onCharactersChange={(characters) =>
            setStorySettings({ ...storySettings, characters })
          }
          onCountChange={(count) =>
            setStorySettings({ ...storySettings, characterCount: count })
          }
          onEnvironmentChange={(environment) =>
            setStorySettings({ ...storySettings, environment })
          }
          onChildProfileChange={setChildProfile}
          onCreateStory={generateStory}
        />
      </main>
    </div>
  );
}