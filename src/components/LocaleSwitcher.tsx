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
    <div className="fixed top-4 right-4 z-50">
      <div className="relative group">
        <button
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all border border-orange-200"
          aria-label="Changer de langue"
        >
          <Globe className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-gray-700 uppercase">{locale}</span>
        </button>

        {/* Dropdown */}
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="p-2">
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => switchLocale(loc.code)}
                className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                  locale === loc.code
                    ? 'bg-orange-100 text-orange-700 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="font-semibold">{loc.label}</span>
                <span className="ml-2 text-sm">{loc.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
