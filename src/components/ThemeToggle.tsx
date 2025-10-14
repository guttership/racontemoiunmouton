'use client';

import { useTheme } from '@/lib/theme-provider';
import { useTranslations } from '@/lib/i18n-provider';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations();

  const themes: Array<{ value: 'light' | 'dark' | 'system'; icon: React.ReactNode; label: string }> = [
    { value: 'light', icon: <Sun className="h-5 w-5" />, label: t('Theme.light') },
    { value: 'dark', icon: <Moon className="h-5 w-5" />, label: t('Theme.dark') },
    { value: 'system', icon: <Monitor className="h-5 w-5" />, label: t('Theme.system') },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => {
          const currentIndex = themes.findIndex(t => t.value === theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          setTheme(themes[nextIndex].value);
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#2a2a29] border-2 border-gray-200 dark:border-[#3f3f3e] hover:border-orange-500 dark:hover:border-[#ff7519] transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-none"
        title={currentTheme.label}
        aria-label={t('Theme.toggle')}
      >
        <span className="text-gray-700 dark:text-gray-100 transition-colors">
          {currentTheme.icon}
        </span>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-100 hidden sm:inline">
          {currentTheme.label}
        </span>
      </button>
    </div>
  );
}
