'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ModernBackground } from '@/components/illustrations/OrganicShapes';

export default function LegalNoticePage() {
  const t = useTranslations('LegalNotice');
  const tHome = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#313231] relative transition-colors duration-300">
      <ModernBackground />

      <div className="relative max-w-4xl mx-auto p-4 md:p-8 z-10">
        {/* Header */}
        <div className="bg-white dark:bg-[#2a2a29] rounded-3xl p-6 md:p-8 mb-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <h1 className="text-3xl md:text-4xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
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
        <div className="bg-white dark:bg-[#2a2a29] rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="prose prose-lg max-w-none space-y-6">
            {/* Éditeur */}
            <section>
              <h2 className="text-xl md:text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-3">
                {t('editor')}
              </h2>
              <div className="text-gray-700 dark:text-gray-200 font-clash-grotesk space-y-2">
                <p><strong>Yann Gutter</strong></p>
                <p>Email: <a href="mailto:designmoiunmouton@gmail.com" className="text-[#ff7519] hover:underline">designmoiunmouton@gmail.com</a></p>
                <p>Site web: <a href="https://dmum.eu" target="_blank" rel="noopener" className="text-[#ff7519] hover:underline">dmum.eu</a></p>
              </div>
            </section>

            {/* Hébergement */}
            <section>
              <h2 className="text-xl md:text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-3">
                {t('hosting')}
              </h2>
              <div className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                <p><strong>Vercel Inc.</strong></p>
                <p>340 S Lemon Ave #4133</p>
                <p>Walnut, CA 91789, USA</p>
                <p>Site: <a href="https://vercel.com" target="_blank" rel="noopener" className="text-[#ff7519] hover:underline">vercel.com</a></p>
              </div>
            </section>

            {/* CGU */}
            <section>
              <h2 className="text-xl md:text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-3">
                {t('terms')}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk mb-4">
                {t('termsIntro')}
              </p>
            </section>

            {/* Description du service */}
            <section>
              <h3 className="text-lg md:text-xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
                {t('serviceDescription')}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk mb-2">
                {t('serviceDescriptionText')}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 font-clash-grotesk space-y-1">
                <li><strong>{t('freePlan')} :</strong> {t('freePlanText')}</li>
                <li><strong>{t('premiumPlan')} :</strong> {t('premiumPlanText')}</li>
              </ul>
            </section>

            {/* Paiement */}
            <section>
              <h3 className="text-lg md:text-xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
                {t('payment')}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                {t('paymentText')}
              </p>
            </section>

            {/* Remboursement */}
            <section>
              <h3 className="text-lg md:text-xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
                {t('refund')}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                {t('refundText')}
              </p>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h3 className="text-lg md:text-xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
                {t('intellectualProperty')}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                {t('intellectualPropertyText')}
              </p>
            </section>

            {/* Responsabilité utilisateur */}
            <section>
              <h3 className="text-lg md:text-xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
                {t('userResponsibility')}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                {t('userResponsibilityText')}
              </p>
            </section>

            {/* Limitation de responsabilité */}
            <section>
              <h3 className="text-lg md:text-xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
                {t('limitation')}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                {t('limitationText')}
              </p>
            </section>

            {/* Résiliation */}
            <section>
              <h3 className="text-lg md:text-xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
                {t('termination')}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                {t('terminationText')}
              </p>
            </section>

            {/* Données personnelles */}
            <section>
              <h2 className="text-xl md:text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-3">
                {t('data')}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk mb-3">
                {t('dataText')}
              </p>
              <h3 className="text-lg md:text-xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
                {t('dataUsage')}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk mb-3">
                {t('dataUsageText')}
              </p>
              <h3 className="text-lg md:text-xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
                {t('dataRights')}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                {t('dataRightsText')}
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl md:text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-3">
                {t('cookies')}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                {t('cookiesText')}
              </p>
            </section>

            {/* Intelligence Artificielle */}
            <section>
              <h2 className="text-xl md:text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-3">
                {t('ai')}
              </h2>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                {t('aiText')}
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h3 className="text-lg md:text-xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
                {t('updates')}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                {t('updatesText')}
              </p>
            </section>

            {/* Contact */}
            <section>
              <h3 className="text-lg md:text-xl font-courgette text-gray-800 dark:text-gray-100 mb-2">
                {t('contact')}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">
                {t('contactText')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
