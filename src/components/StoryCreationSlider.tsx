'use client';

import React, { useState } from 'react';
import { useTranslations } from '@/lib/i18n-provider';
import { Button } from '@/components/ui/button';
import CharacterSelector from '@/components/CharacterSelector';
import EnvironmentSelector from '@/components/EnvironmentSelector';
import ChildProfileSelector from '@/components/ChildProfileSelector';
import { ChildProfile } from '@/types/story';

interface StoryCreationSliderProps {
  selectedCharacters: string[];
  characterCount: number;
  selectedEnvironment: string;
  childProfile: ChildProfile;
  isGenerating?: boolean;
  onCharactersChange: (characters: string[]) => void;
  onCountChange: (count: number) => void;
  onEnvironmentChange: (environment: string) => void;
  onChildProfileChange: (profile: ChildProfile) => void;
  onCreateStory: () => void;
}

export default function StoryCreationSlider({
  selectedCharacters,
  characterCount,
  selectedEnvironment,
  childProfile,
  isGenerating = false,
  onCharactersChange,
  onCountChange,
  onEnvironmentChange,
  onChildProfileChange,
  onCreateStory,
}: StoryCreationSliderProps) {
  const t = useTranslations('StoryCreation');
  const tChar = useTranslations('Characters');
  const tEnv = useTranslations('Environment');
  const tProfile = useTranslations('ChildProfile');
  
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'characters',
      title: tChar('title'),
      component: (
        <CharacterSelector
          selectedCharacters={selectedCharacters}
          characterCount={characterCount}
          onCharactersChange={onCharactersChange}
          onCountChange={onCountChange}
        />
      ),
      isValid: selectedCharacters.length > 0 && characterCount > 0,
    },
    {
      id: 'environment',
      title: tEnv('title'),
      component: (
        <EnvironmentSelector
          selectedEnvironment={selectedEnvironment}
          onEnvironmentChange={onEnvironmentChange}
        />
      ),
      isValid: selectedEnvironment.length > 0,
    },
    {
      id: 'profile',
      title: tProfile('title'),
      component: (
        <ChildProfileSelector
          childProfile={childProfile}
          onProfileChange={onChildProfileChange}
        />
      ),
      isValid: childProfile.name && childProfile.name.length > 0 && childProfile.age && childProfile.age > 0,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onCreateStory();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4">
      {/* Indicateur de progression */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-center mb-4 px-2 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-shrink-0 min-w-0">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-colors flex-shrink-0 ${
                  index === currentStep
                    ? 'bg-[#ff7519] text-white'
                    : index < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 dark:bg-[#555554] text-gray-600 dark:text-gray-300'
                }`}
              >
                {index < currentStep ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="md:w-4 md:h-4"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 md:w-16 h-1 mx-1 md:mx-2 transition-colors flex-shrink-0 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-[#555554]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center px-2">
          <h2 className="font-courgette text-xl sm:text-2xl md:text-3xl mb-2 dark:text-gray-100">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-200 font-clash-grotesk text-sm md:text-base">
            {t('step', { step: currentStep + 1, total: steps.length })}
          </p>
        </div>
      </div>

      {/* Contenu avec effet slide */}
      <div className="relative">
        <div className="w-full">
          <div className="px-2 md:px-4">
            {/* Affichage direct de l'étape courante sans overflow */}
            <div key={currentStepData.id}>
              {currentStepData.component}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6 md:mt-8 px-2 md:px-4">
        <Button
          onClick={prevStep}
          disabled={currentStep === 0}
          variant="outline"
          className="hand-drawn-button hand-drawn-button-outline text-sm md:text-base px-3 md:px-4 py-2"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 md:mr-2 md:w-4 md:h-4"
          >
            <path
              d="M19 12H5m7-7l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t('previous')}
        </Button>

        <div className="flex gap-1 md:gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                index === currentStep ? 'bg-[#ff7519]' : 'bg-gray-300 dark:bg-[#555554]'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={nextStep}
          disabled={!currentStepData.isValid || isGenerating}
          className="hand-drawn-button hand-drawn-button-primary text-sm md:text-base px-3 md:px-4 py-2"
        >
          {currentStep === steps.length - 1 ? (
            <>
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-1 md:mr-2">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="md:w-4 md:h-4"
                    >
                      <path
                        d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.49 8.49l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.49-8.49l2.83-2.83"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  {t('generating')}
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 md:mr-2 md:w-4 md:h-4"
                  >
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      fill="currentColor"
                    />
                  </svg>
                  {t('generate')}
                </>
              )}
            </>
          ) : (
            <>
              {t('next')}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1 md:ml-2 md:w-4 md:h-4"
              >
                <path
                  d="M5 12h14m-7-7l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}