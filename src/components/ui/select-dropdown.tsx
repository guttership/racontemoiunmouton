'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  options: Option[];
  selectedValue: string;
  onSelectionChange: (value: string) => void;
  placeholder?: string;
  maxHeight?: string;
  className?: string;
}

export default function SelectDropdown({
  options,
  selectedValue,
  onSelectionChange,
  placeholder = 'Sélectionner...',
  maxHeight = 'max-h-60',
  className = ''
}: SelectDropdownProps) {
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

  const handleSelectOption = (value: string) => {
    onSelectionChange(value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const selectedOption = options.find(opt => opt.value === selectedValue);
  const displayValue = selectedOption ? selectedOption.label : '';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input de recherche avec sélection */}
      <div className="hand-drawn-input min-h-[48px] p-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
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
              const isSelected = selectedValue === option.value;
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelectOption(option.value)}
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
