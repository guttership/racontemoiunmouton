'use client';

import React, { useState } from 'react';
import CharacterSelector from '@/components/CharacterSelector';
import EnvironmentSelector from '@/components/EnvironmentSelector';
import ChildProfileSelector from '@/components/ChildProfileSelector';
import StoryReader from '@/components/StoryReader';
import { Button } from '@/components/ui/button';
import { StorySettings, ChildProfile } from '@/types/story';
import { ModernBackground } from '@/components/illustrations/OrganicShapes';
import { SheepIllustration, CharacterIcon, EnvironmentIcon, ChildIcon, StoryIcon, AudioIcon } from '@/components/illustrations/ModernIcons';

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
        throw new Error('Erreur lors de la génération');
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

  // Vue de l'histoire générée avec design moderne
  if (generatedStory) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <ModernBackground />
        
        <div className="relative max-w-5xl mx-auto p-4 z-10">
          {/* En-tête de l'histoire */}
          <div className="bg-white  rounded-3xl p-8  border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <StoryIcon className="w-16 h-16" />
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Votre histoire magique
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Une création unique pour votre enfant
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setGeneratedStory('')}
                className="bg-white hover:bg-white border-2 border-gray-200 hover:border-orange-300 text-gray-800 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 "
              >
                <span className="mr-2">🔄</span>
                Nouvelle histoire
              </Button>
            </div>
          </div>

          {/* Lecteur audio moderne */}
          <div className="bg-white  rounded-3xl p-8  border border-gray-100 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <AudioIcon className="w-12 h-12" />
              <h2 className="text-2xl font-bold text-gray-900">
                Écouter l'histoire
              </h2>
            </div>
            <StoryReader story={generatedStory} />
          </div>

          {/* Contenu de l'histoire */}
          <div className="bg-white  rounded-3xl p-8  border border-gray-100">
            <div className="prose max-w-none text-lg leading-relaxed text-gray-800">
              {generatedStory.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-6 first:mb-4 last:mb-0 text-justify">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue principale avec formulaire moderne
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <ModernBackground />
      
      {/* En-tête moderne */}
      <header className="relative text-center py-16 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="w-32 h-32 mx-auto mb-8">
            <SheepIllustration />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Raconte-moi un mouton
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Créez une histoire magique et personnalisée pour le coucher de votre enfant
          </p>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="relative max-w-7xl mx-auto px-4 pb-20 z-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Section personnages */}
          <div className="bg-white  rounded-3xl p-8  border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <CharacterIcon className="w-12 h-12" />
              <h2 className="text-2xl font-bold text-gray-900">
                Personnages
              </h2>
            </div>
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
          </div>

          {/* Section environnement */}
          <div className="bg-white  rounded-3xl p-8  border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <EnvironmentIcon className="w-12 h-12" />
              <h2 className="text-2xl font-bold text-gray-900">
                Environnement
              </h2>
            </div>
            <EnvironmentSelector
              selectedEnvironment={storySettings.environment}
              onEnvironmentChange={(environment) =>
                setStorySettings({ ...storySettings, environment })
              }
            />
          </div>

          {/* Section profil enfant */}
          <div className="bg-white  rounded-3xl p-8  border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <ChildIcon className="w-12 h-12" />
              <h2 className="text-2xl font-bold text-gray-900">
                Profil de l'enfant
              </h2>
            </div>
            <ChildProfileSelector
              childProfile={childProfile}
              onProfileChange={setChildProfile}
            />
          </div>
        </div>

        {/* Section génération */}
        <div className="mt-12 text-center">
          <div className="bg-white  rounded-3xl p-8  border border-gray-100 max-w-2xl mx-auto">
            <Button
              onClick={generateStory}
              disabled={!canGenerateStory || isGenerating}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-6 rounded-2xl text-xl font-bold   transition-all duration-200 border-2  w-full"
            >
              {isGenerating ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Création de votre histoire magique...
                </>
              ) : (
                <>
                  <span className="text-2xl mr-3">✨</span>
                  Créer mon histoire magique
                </>
              )}
            </Button>
            
            {!canGenerateStory && (
              <div className="mt-6">
                <p className="text-gray-600 bg-white border border-gray-200 rounded-2xl p-4 text-center">
                  <span className="text-orange-500 text-lg mr-2">💡</span>
                  Sélectionnez au moins un personnage et un environnement pour commencer
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Guide d'utilisation moderne */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white  rounded-2xl p-6  border border-gray-100 text-center">
            <CharacterIcon className="w-16 h-16 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Choisir les héros</h3>
            <p className="text-gray-600 text-sm">Sélectionnez les personnages de l'aventure</p>
          </div>
          
          <div className="bg-white  rounded-2xl p-6  border border-gray-100 text-center">
            <EnvironmentIcon className="w-16 h-16 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Définir le décor</h3>
            <p className="text-gray-600 text-sm">Où se déroule cette histoire ?</p>
          </div>
          
          <div className="bg-white  rounded-2xl p-6  border border-gray-100 text-center">
            <ChildIcon className="w-16 h-16 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Adapter à l'âge</h3>
            <p className="text-gray-600 text-sm">Pour une histoire parfaite</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-100 to-orange-50  rounded-2xl p-6  border border-gray-200 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white0 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">✨</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Magie en action</h3>
            <p className="text-gray-600 text-sm">L'IA crée votre histoire unique</p>
          </div>
        </div>
      </main>
    </div>
  );
}
