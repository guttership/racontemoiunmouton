import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModernBackground } from '@/components/illustrations/OrganicShapes';
import { generateHubContent } from '@/lib/seo/content-generator';
import { STORY_THEMES } from '@/lib/seo/theme-dataset';

const FR_DOMAIN = 'https://racontemoiunmouton.fr';
const EN_DOMAIN = 'https://tellmeasheep.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale !== 'fr') {
    return {
      title: 'Page introuvable',
      description: 'Cette page est indisponible.',
    };
  }

  return {
    title: 'Histoires du soir par theme | Raconte-moi un mouton',
    description:
      'Decouvrez nos pages themes pour creer des histoires du soir personnalisees avec generation instantanee et narration audio.',
    alternates: {
      canonical: `${FR_DOMAIN}/fr/histoires-du-soir`,
      languages: {
        'x-default': `${FR_DOMAIN}/fr/histoires-du-soir`,
        fr: `${FR_DOMAIN}/fr/histoires-du-soir`,
        en: `${EN_DOMAIN}/en/bedtime-stories`,
        es: `${EN_DOMAIN}/es/bedtime-stories`,
        de: `${EN_DOMAIN}/de/bedtime-stories`,
      },
    },
  };
}

export default async function StoriesHubFrPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== 'fr') {
    notFound();
  }

  const content = generateHubContent('fr');

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.title,
    description: content.subtitle,
    url: `${FR_DOMAIN}/fr/histoires-du-soir`,
    inLanguage: 'fr',
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
            {content.title}
          </h1>
          <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk text-base md:text-lg mb-4">
            {content.subtitle}
          </p>
          <p className="text-gray-700 dark:text-gray-200 font-clash-grotesk leading-relaxed">
            {content.intro}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Link href="/fr" className="text-[#ff7519] hover:text-[#e66410] font-clash-grotesk underline">
              {content.homeLabel}
            </Link>
            <Link href={content.ctaHref}>
              <Button className="bg-[#ff7519] hover:bg-[#e66610] text-white font-clash-grotesk px-6 py-5 rounded-2xl text-base shadow-lg transition-all">
                {content.ctaLabel}
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-white dark:bg-[#2a2a29] rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
          <h2 className="text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-4">
            Themes populaires
          </h2>
          <ul className="grid gap-2 md:grid-cols-2">
            {STORY_THEMES.map((theme) => (
              <li key={theme.id}>
                <Link
                  href={`/fr/${theme.locales.fr.slug}`}
                  className="text-[#ff7519] hover:text-[#e66410] font-clash-grotesk underline"
                >
                  {theme.locales.fr.searchQuery}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-[#2a2a29] rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
          <h2 className="text-2xl font-courgette text-gray-800 dark:text-gray-100 mb-4">{content.faqTitle}</h2>
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
