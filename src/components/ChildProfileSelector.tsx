'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from '@/lib/i18n-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChildProfile } from '@/types/story';

interface ChildProfileSelectorProps {
  childProfile: ChildProfile;
  onProfileChange: (profile: ChildProfile) => void;
}

export default function ChildProfileSelector({
  childProfile,
  onProfileChange,
}: ChildProfileSelectorProps) {
  const t = useTranslations('ChildProfile');
  const [showProfile, setShowProfile] = useState(false);
  
  const INTERESTS_OPTIONS = useMemo(() => [
    t('interests.animals'),
    t('interests.music'),
    t('interests.drawing'),
    t('interests.sport'),
    t('interests.dance'),
    t('interests.cooking'),
    t('interests.gardening'),
    t('interests.reading'),
    t('interests.videoGames'),
    t('interests.construction'),
    t('interests.adventure'),
    t('interests.magic'),
    t('interests.science'),
    t('interests.cars'),
    t('interests.planes'),
    t('interests.dinosaurs'),
  ], [t]);
  
  const PERSONALITY_OPTIONS = useMemo(() => [
    t('personality.curious'),
    t('personality.brave'),
    t('personality.shy'),
    t('personality.funny'),
    t('personality.kind'),
    t('personality.creative'),
    t('personality.energetic'),
    t('personality.calm'),
    t('personality.dreamy'),
    t('personality.determined'),
  ], [t]);

  const updateProfile = (updates: Partial<ChildProfile>) => {
    onProfileChange({ ...childProfile, ...updates });
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = childProfile.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    updateProfile({ interests: newInterests });
  };

  const togglePersonality = (trait: string) => {
    const currentTraits = childProfile.personality || [];
    const newTraits = currentTraits.includes(trait)
      ? currentTraits.filter(t => t !== trait)
      : [...currentTraits, trait];
    updateProfile({ personality: newTraits });
  };

  return (
    <div className="hand-drawn-card">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xl sm:text-2xl flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ff7519' }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="font-courgette text-xl sm:text-2xl text-gray-800 dark:text-gray-100">{t('title')}</span>
          </div>
          <Button
            onClick={() => setShowProfile(!showProfile)}
            variant={showProfile ? "default" : "outline"}
            className={`hand-drawn-button ${
              showProfile ? 'hand-drawn-button-primary' : 'hand-drawn-button-outline'
            } w-full sm:w-auto`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 text-[#ff7519]"
            >
              {showProfile ? (
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="currentColor"
                />
              ) : (
                <path
                  d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4zM6.5 9.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"
                  fill="currentColor"
                />
              )}
            </svg>
            <span>{showProfile ? t('hide') : t('customize')}</span>
          </Button>
        </div>
      </div>

      {showProfile && (
        <div className="space-y-6 sm:space-y-8 bg-white dark:bg-[#3f3f3e] rounded-xl m-4 sm:m-6 p-4 sm:p-6 transition-colors duration-300">
          {/* Nom et âge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#ff7519]"
                >
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    fill="currentColor"
                  />
                </svg>
                <span>{t('nameLabel')}</span>
              </label>
              <Input
                type="text"
                placeholder={t('namePlaceholder')}
                value={childProfile.name || ''}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="hand-drawn-input"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                {t('ageLabel')}
              </label>
              <Input
                type="number"
                min="1"
                max="12"
                placeholder={t('agePlaceholder')}
                value={childProfile.age || ''}
                onChange={(e) => updateProfile({ age: e.target.value ? parseInt(e.target.value) : undefined })}
                className="hand-drawn-input"
              />
            </div>
          </div>

          {/* Centres d'intérêt */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              {t('interestsLabel')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {INTERESTS_OPTIONS.map((interest) => (
                <Button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  variant={(childProfile.interests || []).includes(interest) ? "default" : "outline"}
                  className={`hand-drawn-button ${
                    (childProfile.interests || []).includes(interest) 
                      ? 'hand-drawn-button-primary' 
                      : 'hand-drawn-button-outline'
                  } h-auto p-3 text-sm`}
                >
                  <div className="text-center font-medium break-words">{interest}</div>
                </Button>
              ))}
            </div>
          </div>

          {/* Traits de personnalité */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              {/* Icône d'étoile SVG */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#ff7519]"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="currentColor"
                />
              </svg>
              <span>{t('personalityLabel')}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {PERSONALITY_OPTIONS.map((trait) => (
                <Button
                  key={trait}
                  onClick={() => togglePersonality(trait)}
                  variant={(childProfile.personality || []).includes(trait) ? "default" : "outline"}
                  className={`hand-drawn-button ${
                    (childProfile.personality || []).includes(trait) 
                      ? 'hand-drawn-button-primary' 
                      : 'hand-drawn-button-outline'
                  } h-auto p-3 text-sm`}
                >
                  <div className="text-center font-medium break-words">{trait}</div>
                </Button>
              ))}
            </div>
          </div>

          {/* Choses préférées */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              {t('favoriteThingsLabel')}
            </label>
            <textarea
              className="hand-drawn-input min-h-[80px] w-full px-3 py-2 text-sm resize-none"
              rows={3}
              placeholder={t('favoriteThingsPlaceholder')}
              value={(childProfile.favoriteThings || []).join(', ')}
              onChange={(e) => updateProfile({ 
                favoriteThings: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
