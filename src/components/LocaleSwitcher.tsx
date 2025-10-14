'use client';

import { useLocale } from '@/lib/i18n-provider';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

const locales = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
];

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    // Remplace la locale dans l'URL : /fr/path -> /en/path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 bg-white dark:bg-[#2a2a29] backdrop-blur-sm px-4 py-2 rounded-full shadow-lg dark:shadow-none hover:shadow-xl transition-all border-2 border-gray-200 dark:border-[#3f3f3e] hover:border-orange-500 dark:hover:border-[#ff7519]"
        aria-label="Changer de langue"
      >
        <Globe className="w-5 h-5 text-orange-500 dark:text-[#ff7519]" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-100 uppercase">{locale}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2a2a29] rounded-2xl shadow-xl dark:shadow-none border dark:border-[#3f3f3e] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="p-2">
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => switchLocale(loc.code)}
              className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                locale === loc.code
                  ? 'bg-orange-100 dark:bg-[#ff7519]/20 text-orange-700 dark:text-[#ff7519] font-semibold'
                  : 'hover:bg-gray-100 dark:hover:bg-[#4a4a49] text-gray-700 dark:text-gray-200'
              }`}
            >
              <span className="font-semibold">{loc.label}</span>
              <span className="ml-2 text-sm">{loc.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
