'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SelectDropdown from '@/components/ui/select-dropdown';
import { ENVIRONMENT_OPTIONS } from '@/types/story';

interface EnvironmentSelectorProps {
  selectedEnvironment: string;
  onEnvironmentChange: (environment: string) => void;
}

export default function EnvironmentSelector({
  selectedEnvironment,
  onEnvironmentChange,
}: EnvironmentSelectorProps) {
  const [customEnvironment, setCustomEnvironment] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomEnvironment = () => {
    if (customEnvironment.trim()) {
      onEnvironmentChange(customEnvironment.trim());
      setCustomEnvironment('');
      setShowCustom(false);
    }
  };

  return (
    <div className="hand-drawn-card">
      <div className="p-4 sm:p-6">
        <div className="text-xl sm:text-2xl flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
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
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c3.94.49 7 3.85 7 7.93s-3.05 7.44-7 7.93V4.07z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="font-courgette text-xl sm:text-2xl text-gray-800">Choisis l&apos;environnement de l&apos;histoire</span>
        </div>
        
        {/* Saisie libre */}
        <div className="mb-6">
          {!showCustom ? (
            <Button
              onClick={() => setShowCustom(true)}
              className="hand-drawn-button hand-drawn-button-primary flex items-center gap-2 w-full sm:w-auto"
            >
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
              <span>Créer un environnement personnalisé</span>
            </Button>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Décris ton environnement magique
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={customEnvironment}
                  onChange={(e) => setCustomEnvironment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomEnvironment()}
                  className="hand-drawn-input flex-1"
                  placeholder="Ex: Une maison dans les nuages, un jardin de bonbons..."
                  autoFocus
                />
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    onClick={handleCustomEnvironment}
                    disabled={!customEnvironment.trim()}
                    className="hand-drawn-button hand-drawn-button-primary flex-1 sm:flex-initial whitespace-nowrap"
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
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Valider</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCustom(false);
                      setCustomEnvironment('');
                    }}
                    className="hand-drawn-button hand-drawn-button-outline flex-1 sm:flex-initial whitespace-nowrap"
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
                        d="M18 6L6 18m0-12l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>Annuler</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Affichage du choix */}
        {selectedEnvironment && (
          <Button
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-6 py-3 rounded-2xl mb-6 w-full"
            disabled
          >
            {selectedEnvironment}
          </Button>
        )}

        {/* Suggestions avec liste déroulante */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Ou choisis parmi nos suggestions :</h4>
          <SelectDropdown
            options={ENVIRONMENT_OPTIONS.map(env => ({ value: env, label: env }))}
            selectedValue={selectedEnvironment}
            onSelectionChange={onEnvironmentChange}
            placeholder="Sélectionner un environnement..."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
