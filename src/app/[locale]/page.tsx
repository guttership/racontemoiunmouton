'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import StoryCreationSlider from '@/components/StoryCreationSlider';
import StoryReader from '@/components/StoryReader';
import StructuredData from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { StorySettings, ChildProfile } from '@/types/story';
import { ModernBackground } from '@/components/illustrations/OrganicShapes';
import { StoryIcon } from '@/components/illustrations/ModernIcons';
import { Hero } from '@/components/Hero';
import { PremiumBanner } from '@/components/PremiumBanner';

export default function Home() {
  const { data: session } = useSession();
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const creatorRef = useRef<HTMLDivElement>(null);
  
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
  const [showPremiumBanner, setShowPremiumBanner] = useState(false);
  const [showAccountBanner, setShowAccountBanner] = useState(false);
  const [daysUntilNext, setDaysUntilNext] = useState<number>(0);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);

  // Vérifier la limite au chargement de la page pour les utilisateurs non-premium
  useEffect(() => {
    const checkLimit = async () => {
      if (session === undefined || isCheckingLimit) return; // Attendre le chargement de la session
      
      // Premium = pas de limite
      if (session?.user?.isPremium) return;
      
      setIsCheckingLimit(true);
      try {
        const response = await fetch('/api/generate-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characters: ['test'],
            characterCount: 1,
            environment: 'test',
            locale,
            // Flag pour indiquer qu'on veut juste vérifier la limite
            checkOnly: true,
          }),
        });

        if (response.status === 403) {
          const data = await response.json();
          if (data.requiresPremium) {
            setShowPremiumBanner(true);
            setDaysUntilNext(data.daysUntilNext || 0);
          } else if (data.requiresAccount) {
            setShowAccountBanner(true);
            setDaysUntilNext(data.daysUntilNext || 0);
          }
        }
      } catch (error) {
        console.error('Error checking limit:', error);
      } finally {
        setIsCheckingLimit(false);
      }
    };

    checkLimit();
  }, [session, locale, isCheckingLimit]);

  const scrollToCreator = () => {
    creatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const generateStory = async () => {
    setIsGenerating(true);
    setShowPremiumBanner(false);
    setShowAccountBanner(false);
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
        const data = await response.json();
        
        // Si erreur de limite (403)
        if (response.status === 403) {
          if (data.requiresPremium) {
            setShowPremiumBanner(true);
            setDaysUntilNext(data.daysUntilNext || 0);
            return;
          }
          if (data.requiresAccount) {
            setShowAccountBanner(true);
            setDaysUntilNext(data.daysUntilNext || 0);
            return;
          }
        }
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
                {t('newStory')}
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

      {/* Hero Section - Landing page style */}
      {!session?.user && !generatedStory && (
        <Hero onStartCreating={scrollToCreator} />
      )}

      <main itemScope itemType="https://schema.org/WebSite">
        {/* Header classique pour utilisateurs connectés */}
        {session?.user && !generatedStory && (
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
        )}

        {/* Premium Banner si limite atteinte */}
        {showPremiumBanner && (
          <div className="max-w-3xl mx-auto px-4 mb-8">
            <PremiumBanner />
          </div>
        )}

        {/* Account Banner pour utilisateurs anonymes */}
        {showAccountBanner && (
          <div className="max-w-3xl mx-auto px-4 mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-2">
                {t('accountRequired') || 'Créez un compte gratuit'}
              </h3>
              <p className="mb-4">
                {t('accountLimitMessage') || `Vous avez atteint la limite de 1 histoire tous les 5 jours pour les visiteurs. Créez un compte gratuit pour continuer ! (${daysUntilNext} jour${daysUntilNext > 1 ? 's' : ''} restant${daysUntilNext > 1 ? 's' : ''})`}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => window.location.href = `/${locale}/auth/signup`}
                  className="bg-white text-orange-600 hover:bg-gray-100"
                >
                  {t('createAccount') || 'Créer un compte'}
                </Button>
                <Button
                  onClick={() => window.location.href = `/${locale}/auth/signin`}
                  className="bg-orange-700 text-white hover:bg-orange-800"
                >
                  {t('signIn') || 'Se connecter'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Story Creator */}
        <div ref={creatorRef} className="relative mx-auto px-2 md:px-4 pb-4 z-10">
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
        </div>
      </main>
    </div>
  );
}
