'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from '@/lib/i18n-provider';
import StoryCreationSlider from '@/components/StoryCreationSlider';
import StoryReader from '@/components/StoryReader';
import StructuredData from '@/components/StructuredData';
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
          locale,
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

  useEffect(() => {
    if (generatedStory && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [generatedStory]);

  if (generatedStory) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#313231] relative transition-colors duration-300">
        <StructuredData />
        <ModernBackground />

        <div className="relative max-w-5xl mx-auto p-4 z-10">
          <div className="bg-white dark:bg-[#2a2a29] rounded-3xl p-6 md:p-8 mb-8 transition-colors duration-300 shadow-sm dark:shadow-none">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3 md:gap-4">
                <StoryIcon className="w-12 h-12 md:w-16 md:h-16" />
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-courgette text-gray-900 dark:text-gray-100">
                    {t('storyTitle') || 'Votre histoire magique'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 font-clash-grotesk text-sm md:text-base">
                    {t('storySubtitle') || 'Une création unique pour votre enfant'}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setGeneratedStory('')}
                className="bg-gray-100 dark:bg-[#3f3f3e] text-gray-800 dark:text-gray-100 px-4 md:px-6 py-2 md:py-3 rounded-2xl font-clash-grotesk font-semibold text-sm md:text-base hover:bg-gray-200 dark:hover:bg-[#4a4a49] transition-colors border-gray-200 dark:border-[#3f3f3e]"
              >
                {tApp('newStory') || 'Nouvelle histoire'}
              </Button>
            </div>
          </div>

          <StoryReader story={generatedStory} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#313231] relative transition-colors duration-300">
      <StructuredData />
      <ModernBackground />

      <main itemScope itemType="https://schema.org/WebSite">
        <header className="flex flex-col items-center justify-center py-8">
          <Image 
            src="/logo_mouton.svg" 
            alt="Logo Raconte-moi un mouton" 
            width={80} 
            height={80} 
            className="mb-4" 
            priority 
          />
          <h1 itemProp="name" className="text-3xl md:text-4xl font-courgette text-[#ff7519] dark:text-[#ff7519] mb-2 text-center">
            {t('title')}
          </h1>
          <p itemProp="description" className="text-lg text-gray-700 dark:text-gray-200 text-center max-w-2xl mx-auto px-4">
            {t('subtitle')}
          </p>
        </header>

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
