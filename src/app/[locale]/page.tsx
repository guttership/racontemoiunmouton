'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import StoryCreationSlider from '@/components/StoryCreationSlider';
import StoryReader from '@/components/StoryReader';
import { Button } from '@/components/ui/button';
import { StorySettings, ChildProfile } from '@/types/story';
import { ModernBackground } from '@/components/illustrations/OrganicShapes';
import { StoryIcon } from '@/components/illustrations/ModernIcons';

export default function Home() {
  const t = useTranslations('HomePage');
  const tApp = useTranslations('App');
  const locale = useLocale();
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
          locale, // Passer la langue à l'API
        }),
      });

      if (!response.ok) {
        throw new Error(`Error generating story: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedStory(data.story);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during generation');
    } finally {
      setIsGenerating(false);
    }
  };

  // Scroll automatique en haut lors de l'affichage de l'histoire
  useEffect(() => {
    if (generatedStory && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [generatedStory]);

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
                    {t('title')}
                  </h1>
                  <p className="text-gray-600 mt-1 font-clash-grotesk text-sm md:text-base">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setGeneratedStory('')}
                className="bg-gray-100 text-gray-800 px-4 md:px-6 py-2 md:py-3 rounded-2xl font-clash-grotesk font-semibold text-sm md:text-base"
              >
                {t('newStory')}
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
      
      <main itemScope itemType="https://schema.org/WebSite">
        {/* Header */}
        <header className="flex flex-col items-center justify-center py-8">
          <Image src="/logo_mouton.svg" alt={tApp('title')} width={80} height={80} className="mb-4" priority aria-label={tApp('title')} />
          <h1 itemProp="name" className="text-3xl md:text-4xl font-courgette text-[#ff7519] mb-2 text-center">
            {tApp('title')}
          </h1>
          <p itemProp="description" className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
            {tApp('description')}<br />
            <span className="text-sm text-gray-500">{tApp('tagline')}</span>
          </p>
        </header>

        {/* Contenu principal avec slider */}
        <main className="relative mx-auto px-2 md:px-4 pb-4 z-10">
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
      </main>
    </div>
  );
}