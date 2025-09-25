'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  maxHeight?: string;
  className?: string;
}

export default function MultiSelectDropdown({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = 'Sélectionner...',
  maxHeight = 'max-h-60',
  className = ''
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrer les options selon le terme de recherche
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fermer la liste déroulante si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    onSelectionChange(newSelection);
  };

  const removeSelection = (value: string) => {
    onSelectionChange(selectedValues.filter(v => v !== value));
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input de recherche avec selections */}
      <div className="hand-drawn-input min-h-[40px] md:min-h-[48px] p-2 md:p-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex flex-wrap gap-1 md:gap-2 mb-1 md:mb-2">
          {selectedValues.map((value) => {
            const option = options.find(opt => opt.value === value);
            return (
              <Badge
                key={value}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 text-white rounded-full text-xs"
                style={{ backgroundColor: '#ff7519' }}
              >
                <span className="max-w-[80px] md:max-w-none truncate">
                  {option?.label || value}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelection(value);
                  }}
                  className="text-white hover:text-red-200 ml-1 flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="md:w-3 md:h-3"
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
            );
          })}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={selectedValues.length === 0 ? placeholder : 'Rechercher...'}
          className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
        />
        
        {/* Flèche */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`text-[#ff7519] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path
              d="M19 9l-7 7-7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Liste déroulante */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 ${maxHeight} overflow-y-auto`}>
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">Aucune option trouvée</div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => handleToggleOption(option.value)}
                  className={`p-3 cursor-pointer hover:bg-orange-50 transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-orange-100' : ''
                  }`}
                >
                  <span className="text-gray-700 flex-1">{option.label}</span>
                  {isSelected && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#ff7519]"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
