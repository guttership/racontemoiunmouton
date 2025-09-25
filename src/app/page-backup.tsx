'use client';

import React, { useState } from 'react';
import CharacterSelector from '@/components/CharacterSelector';
import EnvironmentSelector from '@/components/EnvironmentSelector';
import ChildProfileSelector from '@/components/ChildProfileSelector';
import StoryReader from '@/components/StoryReader';
import { Button } from '@/components/ui/button';
import { StorySettings, ChildProfile } from '@/types/story';

export default function Home() {
  const [storySettings, setStorySettings] = useState<StorySettings>({
    characters: [],
    characterCount: 1,
    environment: '',
  });
  
  const [childProfile, setChildProfile] = useState<ChildProfile>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string>('');

  const canGenerateStory = storySettings.characters.length > 0 && storySettings.environment;

  const generateStory = async () => {
    if (!canGenerateStory) return;

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
        throw new Error('Erreur lors de la g�n�ration');
      }

      const data = await response.json();
      setGeneratedStory(data.story);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la g�n�ration');
    } finally {
      setIsGenerating(false);
    }
  };

  if (generatedStory) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="hand-drawn-card">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white0 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-white">📖</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-courgette text-gray-800">
                    Votre histoire
                  </h2>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setGeneratedStory('')}
                  className="hand-drawn-button hand-drawn-button-outline flex items-center gap-2 w-full sm:w-auto"
                >
                  <span>🔄</span>
                  <span>Nouvelle histoire</span>
                </Button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8  border-2 border-gray-100">
                <div className="prose max-w-none text-base sm:text-lg leading-relaxed text-gray-800 font-clash-grotesk">
                  {generatedStory.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-4 sm:mb-6 first:mb-2 sm:first:mb-4 last:mb-0 text-justify font-clash-grotesk">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>
              
              <StoryReader story={generatedStory} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-4xl lg:max-w-6xl mx-auto">
        <div className="hand-drawn-card">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-8 lg:mb-12">
              <div className="illustration-container mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white0 rounded-full flex items-center justify-center ">
                  <span className="text-3xl sm:text-4xl lg:text-5xl">🐑</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-courgette text-gray-800 mb-4 lg:mb-6">
                Raconte-moi un mouton
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 font-clash-grotesk">
                Créez une histoire magique et personnalisée pour le coucher de votre enfant grâce à l&apos;intelligence artificielle
              </p>
            </div>

            <div className="space-y-6 lg:space-y-10">
              <CharacterSelector
                selectedCharacters={storySettings.characters}
                characterCount={storySettings.characterCount}
                onCharactersChange={(characters) =>
                  setStorySettings({ ...storySettings, characters })
                }
                onCountChange={(count) =>
                  setStorySettings({ ...storySettings, characterCount: count })
                }
              />

              <EnvironmentSelector
                selectedEnvironment={storySettings.environment}
                onEnvironmentChange={(environment) =>
                  setStorySettings({ ...storySettings, environment })
                }
              />

              <ChildProfileSelector
                childProfile={childProfile}
                onProfileChange={setChildProfile}
              />

              <div className="text-center pt-6 lg:pt-8">
                <Button
                  onClick={generateStory}
                  disabled={!canGenerateStory || isGenerating}
                  size="lg"
                  className="hand-drawn-button hand-drawn-button-primary text-lg lg:text-xl px-8 sm:px-12 py-3 lg:py-4 w-full sm:w-auto flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm sm:text-base lg:text-lg">Génération en cours...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg lg:text-xl">✨</span>
                      <span className="text-sm sm:text-base lg:text-lg">Créer mon histoire magique</span>
                    </>
                  )}
                </Button>
                
                {!canGenerateStory && (
                  <div className="mt-4 mx-auto max-w-sm">
                    <p className="text-sm sm:text-base text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                      💡 Sélectionnez au moins un personnage et un environnement pour commencer
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
