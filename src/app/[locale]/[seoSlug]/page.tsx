import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModernBackground } from '@/components/illustrations/OrganicShapes';
import {
  contentLocaleFromLocale,
  getThemeBySlug,
  ProgrammaticLocale,
  normalizeProgrammaticLocale,
  STORY_THEMES,
} from '@/lib/seo/theme-dataset';
import { generateThemeSeoContent, getRelatedThemes } from '@/lib/seo/content-generator';

const FR_DOMAIN = 'https://racontemoiunmouton.fr';
const EN_DOMAIN = 'https://tellmeasheep.com';

function buildAlternateUrls(theme: (typeof STORY_THEMES)[number]) {
  return {
    fr: `${FR_DOMAIN}/fr/${theme.locales.fr.slug}`,
    en: `${EN_DOMAIN}/en/${theme.locales.en.slug}`,
    es: `${EN_DOMAIN}/es/${theme.locales.es.slug}`,
    de: `${EN_DOMAIN}/de/${theme.locales.de.slug}`,
  };
}

const PROGRAMMATIC_LOCALES: ProgrammaticLocale[] = ['fr', 'en', 'es', 'de'];

export const dynamicParams = false;

export async function generateStaticParams() {
  return PROGRAMMATIC_LOCALES.flatMap((locale) =>
    STORY_THEMES.map((theme) => ({
      locale,
      seoSlug: theme.locales[locale].slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; seoSlug: string }>;
}): Promise<Metadata> {
  const { locale, seoSlug } = await params;
  const normalizedLocale = normalizeProgrammaticLocale(locale);
  const theme = getThemeBySlug(normalizedLocale, seoSlug);

  if (!theme) {
    return {
      title: 'Page introuvable',
      description: 'Cette page est indisponible.',
    };
  }

  const contentLocale = contentLocaleFromLocale(normalizedLocale);
  const content = generateThemeSeoContent({
    locale: contentLocale,
    localePrefix: normalizedLocale,
    theme,
  });

  const alternates = buildAlternateUrls(theme);
  const canonical =
    normalizedLocale === 'fr'
      ? `${FR_DOMAIN}/fr/${theme.locales.fr.slug}`
      : `${EN_DOMAIN}/${normalizedLocale}/${theme.locales[normalizedLocale].slug}`;

  return {
    title: content.seoTitle,
    description: content.metaDescription,
    alternates: {
      canonical,
      languages: {
        'x-default': alternates.fr,
        fr: alternates.fr,
        en: alternates.en,
        es: alternates.es,
        de: alternates.de,
      },
    },
  };
}

export default async function ProgrammaticThemePage({
  params,
}: {
  params: Promise<{ locale: string; seoSlug: string }>;
}) {
  const { locale, seoSlug } = await params;
  const normalizedLocale = normalizeProgrammaticLocale(locale);
  const theme = getThemeBySlug(normalizedLocale, seoSlug);

  if (!theme) {
    notFound();
  }

  const contentLocale = contentLocaleFromLocale(normalizedLocale);
  const content = generateThemeSeoContent({
    locale: contentLocale,
    localePrefix: normalizedLocale,
    theme,
  });

  const relatedThemes = getRelatedThemes(normalizedLocale, content.relatedThemeIds);

  const pageUrl =
    normalizedLocale === 'fr'
      ? `${FR_DOMAIN}/fr/${theme.locales.fr.slug}`
      : `${EN_DOMAIN}/${normalizedLocale}/${theme.locales[normalizedLocale].slug}`;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.h1,
    description: content.metaDescription,
    url: pageUrl,
    inLanguage: normalizedLocale,
    isPartOf: {
      '@type': 'WebSite',
      name: normalizedLocale === 'fr' ? 'Raconte-moi un mouton' : 'Tell Me a Sheep',
      url: normalizedLocale === 'fr' ? FR_DOMAIN : EN_DOMAIN,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#313231] relative transition-colors duration-300">
      <ModernBackground />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="relative max-w-4xl mx-auto p-4 md:p-8 z-10 space-y-6">
        <section className="bg-white dark:bg-[#2a2a29] rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
          <h1 className="text-3xl md:text-4xl font-courgette text-gray-800 dark:text-gray-100 mb-3">
            {content.h1}
          </h1>
          <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk text-base md:text-lg">
            {content.heroSubtitle}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Link
              href={`/${normalizedLocale}`}
              className="text-[#ff7519] hover:text-[#e66410] font-clash-grotesk underline"
            >
              {content.backToHomeLabel}
            </Link>
            <Link
              href={normalizedLocale === 'fr' ? '/fr/histoires-du-soir' : `/${normalizedLocale}/bedtime-stories`}
              className="text-[#ff7519] hover:text-[#e66410] font-clash-grotesk underline"
            >
              {normalizedLocale === 'fr' ? 'Voir tous les themes' : 'Browse all themes'}
            </Link>
          </div>
        </section>

        <section className="bg-white dark:bg-[#2a2a29] rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
          <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk leading-relaxed">
            {content.intro}
          </p>
        </section>

        <section className="bg-white dark:bg-[#2a2a29] rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
          <h2 className="text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-3">
            {normalizedLocale === 'fr' ? 'Exemple de mini histoire' : 'Short story sample'}
          </h2>
          <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk leading-relaxed">
            {content.sampleStory}
          </p>
        </section>

        <section className="bg-white dark:bg-[#2a2a29] rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
          <h2 className="text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-3">
            {content.howItWorksTitle}
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-200 font-clash-grotesk">
            {content.howItWorksSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="mt-6">
            <Link href={content.ctaHref}>
              <Button className="bg-[#ff7519] hover:bg-[#e66610] text-white font-clash-grotesk px-6 py-5 rounded-2xl text-base shadow-lg transition-all">
                {content.ctaLabel}
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-white dark:bg-[#2a2a29] rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
          <h2 className="text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-4">
            {content.relatedTitle}
          </h2>
          <ul className="grid gap-2 md:grid-cols-2">
            {relatedThemes.map((related) => (
              <li key={related.id}>
                <Link
                  href={`/${normalizedLocale}/${related.slug}`}
                  className="text-[#ff7519] hover:text-[#e66410] font-clash-grotesk underline"
                >
                  {related.query}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-[#2a2a29] rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
          <h2 className="text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-4">
            {content.relatedFaqTitle}
          </h2>
          <div className="space-y-4">
            {content.faq.map((item) => (
              <article key={item.question}>
                <h3 className="text-lg font-courgette text-gray-800 dark:text-gray-100 mb-1">
                  {item.question}
                </h3>
                <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
