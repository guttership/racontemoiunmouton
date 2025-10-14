'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from '@/lib/i18n-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import MultiSelectDropdown from '@/components/ui/multi-select-dropdown';

interface CharacterSelectorProps {
  selectedCharacters: string[];
  characterCount: number;
  onCharactersChange: (characters: string[]) => void;
  onCountChange: (count: number) => void;
}

export default function CharacterSelector({
  selectedCharacters,
  characterCount,
  onCharactersChange,
  onCountChange,
}: CharacterSelectorProps) {
  const t = useTranslations('Characters');
  const [customCharacter, setCustomCharacter] = useState('');
  
  const CHARACTER_OPTIONS = useMemo(() => [
    t('options.forestAnimals'),
    t('options.farmAnimals'),
    t('options.seaAnimals'),
    t('options.magicDragons'),
    t('options.fairiesElves'),
    t('options.astronauts'),
    t('options.kindPirates'),
    t('options.princessesPrinces'),
    t('options.friendlyRobots'),
    t('options.kindWitches'),
    t('options.superheroes'),
    t('options.dinosaurs'),
  ], [t]);

  const addCustomCharacter = () => {
    if (customCharacter.trim() && !selectedCharacters.includes(customCharacter.trim())) {
      onCharactersChange([...selectedCharacters, customCharacter.trim()]);
      setCustomCharacter('');
    }
  };

  const removeCharacter = (character: string) => {
    onCharactersChange(selectedCharacters.filter(c => c !== character));
  };

  return (
    <div className="hand-drawn-card">
      <div className="p-4 sm:p-6">
        <div className="text-xl sm:text-2xl flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ff7519] rounded-full flex items-center justify-center">
            {/* Icône de masque de théâtre SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c3.94.49 7 3.85 7 7.93s-3.05 7.44-7 7.93V4.07zM8 15.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm8 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="font-courgette text-xl sm:text-2xl text-gray-800 dark:text-gray-100">{t('title')}</span>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="text-sm font-clash-grotesk font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
            {/* Icône d'écriture SVG */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#ff7519]"
            >
              <path
                d="M3 21h18V3H3v18zM21 1H3C1.9 1 1 1.9 1 3v18c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM8 7h8v2H8V7zm8 6H8v-2h8v2zm-8 4v-2h8v2H8z"
                fill="currentColor"
              />
            </svg>
            <span>{t('addCustom')}</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={customCharacter}
              onChange={(e) => setCustomCharacter(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomCharacter()}
              className="hand-drawn-input flex-1"
              placeholder={t('placeholder')}
            />
            <Button
              onClick={addCustomCharacter}
              disabled={!customCharacter.trim()}
              className="hand-drawn-button hand-drawn-button-primary px-4 py-2 w-full sm:w-auto whitespace-nowrap"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M12 5v14m-7-7h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>{t('addButton')}</span>
            </Button>
          </div>
        </div>

        {/* Personnages sélectionnés */}
        {selectedCharacters.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('selected')}</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCharacters.map((character) => (
                <Badge
                  key={character}
                  variant="default"
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-full"
                  style={{ backgroundColor: '#ff7519' }}
                >
                  {character}
                  <button
                    onClick={() => removeCharacter(character)}
                    className="text-white hover:text-red-200 ml-1 flex items-center justify-center"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18m0-12l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions avec liste déroulante */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('suggestions')}</h4>
          <MultiSelectDropdown
            options={CHARACTER_OPTIONS.map(char => ({ value: char, label: char }))}
            selectedValues={selectedCharacters}
            onSelectionChange={onCharactersChange}
            placeholder={t('selectPlaceholder')}
            className="w-full"
          />
        </div>

        <div>
          <h4 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#ff7519]"
            >
              <path
                d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h2v2H7V7zm4 0h2v2h-2V7zm4 0h2v2h-2V7zM7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM7 15h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"
                fill="currentColor"
              />
            </svg>
            <span>{t('howMany')}</span>
          </h4>
          <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
            {[1, 2, 3, 4, 5].map((count) => (
              <Button
                key={count}
                onClick={() => onCountChange(count)}
                variant={characterCount === count ? "default" : "outline"}
                className={`hand-drawn-button ${
                  characterCount === count 
                    ? 'hand-drawn-button-primary' 
                    : 'hand-drawn-button-outline'
                } w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0 text-base sm:text-lg font-bold`}
              >
                {count}
              </Button>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
