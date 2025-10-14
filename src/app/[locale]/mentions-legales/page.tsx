'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from '@/lib/i18n-provider';
import { ModernBackground } from '@/components/illustrations/OrganicShapes';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function LegalNoticePage() {
  const t = useTranslations('LegalNotice');
  const tHome = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <ModernBackground />
      <LocaleSwitcher />

      <div className="relative max-w-4xl mx-auto p-4 md:p-8 z-10">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 mb-6 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-courgette text-gray-800 mb-2">
            {t('title')}
          </h1>
          <Link
            href={`/${locale}`}
            className="text-[#ff7519] hover:text-[#e66410] font-clash-grotesk text-sm md:text-base underline"
          >
            ← {tHome('backToCreation')}
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="prose prose-lg max-w-none space-y-6">
            {/* Éditeur */}
            <section>
              <h2 className="text-xl md:text-2xl font-courgette text-gray-800 mb-3">
                {t('editor')}
              </h2>
              <div className="text-gray-700 font-clash-grotesk space-y-2">
                <p><strong>Yann Gutter</strong></p>
                <p>Email: <a href="mailto:designmoiunmouton@gmail.com" className="text-[#ff7519] hover:underline">designmoiunmouton@gmail.com</a></p>
                <p>Site web: <a href="https://dmum.eu" target="_blank" rel="noopener" className="text-[#ff7519] hover:underline">dmum.eu</a></p>
              </div>
            </section>

            {/* Hébergement */}
            <section>
              <h2 className="text-xl md:text-2xl font-courgette text-gray-800 mb-3">
                {t('hosting')}
              </h2>
              <div className="text-gray-700 font-clash-grotesk">
                <p><strong>Vercel Inc.</strong></p>
                <p>340 S Lemon Ave #4133</p>
                <p>Walnut, CA 91789, USA</p>
                <p>Site: <a href="https://vercel.com" target="_blank" rel="noopener" className="text-[#ff7519] hover:underline">vercel.com</a></p>
              </div>
            </section>

            {/* Données personnelles */}
            <section>
              <h2 className="text-xl md:text-2xl font-courgette text-gray-800 mb-3">
                {t('data')}
              </h2>
              <p className="text-gray-700 font-clash-grotesk">
                {t('dataText')}
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl md:text-2xl font-courgette text-gray-800 mb-3">
                {t('cookies')}
              </h2>
              <p className="text-gray-700 font-clash-grotesk">
                {t('cookiesText')}
              </p>
            </section>

            {/* Intelligence Artificielle */}
            <section>
              <h2 className="text-xl md:text-2xl font-courgette text-gray-800 mb-3">
                {t('ai')}
              </h2>
              <p className="text-gray-700 font-clash-grotesk">
                {t('aiText')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
