"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import Image from "next/image";

export function Hero({ onStartCreating }: { onStartCreating?: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("HomePage");

  const handleGetStarted = () => {
    if (session?.user) {
      if (onStartCreating) {
        onStartCreating();
      }
    } else {
      router.push(`/${locale}/auth/signup?returnUrl=/${locale}`);
    }
  };

  const handleSeePricing = () => {
    router.push(`/${locale}/premium`);
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 relative">
            <Image 
              src="/logo_mouton.svg" 
              alt="Logo Raconte-moi un mouton" 
              fill
              style={{ objectFit: 'contain' }}
              priority 
            />
          </div>
        </div>

        {/* Titre principal */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-courgette text-[#ff7519]">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-200 font-clash-grotesk max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Boutons CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleGetStarted}
            className="bg-[#ff7519] hover:bg-[#e66610] text-white font-clash-grotesk px-8 py-6 rounded-2xl text-lg shadow-lg transition-all"
          >
            {session?.user ? t('newStory') : t('getStarted')}
          </Button>
          
          <Button
            onClick={handleSeePricing}
            variant="outline"
            className="font-clash-grotesk px-8 py-6 rounded-2xl text-lg border-2 hover:border-[#ff7519] hover:text-[#ff7519] transition-all"
          >
            <Crown className="w-5 h-5 mr-2" />
            {t('seePricing')}
          </Button>
        </div>

        {/* Note prix */}
        <p className="text-sm text-gray-600 dark:text-gray-400 font-clash-grotesk">
          {t('pricingNote')}
        </p>
      </div>
    </div>
  );
}
