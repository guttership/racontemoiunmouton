import { createSeoSlug } from './slug-generator';

export type ProgrammaticLocale = 'fr' | 'en' | 'es' | 'de';
export type ContentLocale = 'fr' | 'en';

export type ThemeId =
  | 'forestAnimals'
  | 'farmAnimals'
  | 'seaAnimals'
  | 'astronauts'
  | 'witches'
  | 'dinosaur'
  | 'princess'
  | 'dragon'
  | 'unicorn'
  | 'pirate'
  | 'robot'
  | 'fairy'
  | 'knight'
  | 'space'
  | 'jungle'
  | 'mermaid'
  | 'superhero';

type ThemeLocaleEntry = {
  name: string;
  searchQuery: string;
  slug: string;
};

export type ThemeEntry = {
  id: ThemeId;
  related: ThemeId[];
  locales: Record<ProgrammaticLocale, ThemeLocaleEntry>;
};

function withDerivedSlugs(
  id: ThemeId,
  related: ThemeId[],
  fr: Omit<ThemeLocaleEntry, 'slug'> & { slug?: string },
  en: Omit<ThemeLocaleEntry, 'slug'> & { slug?: string }
): ThemeEntry {
  const frSlug = fr.slug ?? createSeoSlug(fr.searchQuery);
  const enSlug = en.slug ?? createSeoSlug(en.searchQuery);

  return {
    id,
    related,
    locales: {
      fr: {
        name: fr.name,
        searchQuery: fr.searchQuery,
        slug: frSlug,
      },
      en: {
        name: en.name,
        searchQuery: en.searchQuery,
        slug: enSlug,
      },
      // Les locales ES/DE réutilisent la variante EN pour garantir des URLs stables.
      es: {
        name: en.name,
        searchQuery: en.searchQuery,
        slug: enSlug,
      },
      de: {
        name: en.name,
        searchQuery: en.searchQuery,
        slug: enSlug,
      },
    },
  };
}

export const STORY_THEMES: ThemeEntry[] = [
  withDerivedSlugs(
    'forestAnimals',
    ['farmAnimals', 'seaAnimals', 'jungle', 'fairy'],
    { name: 'animaux de la foret', searchQuery: 'histoire animaux foret enfant', slug: 'histoire-animaux-foret-enfant' },
    { name: 'forest animals', searchQuery: 'forest animals bedtime story', slug: 'forest-animals-bedtime-story' }
  ),
  withDerivedSlugs(
    'farmAnimals',
    ['forestAnimals', 'seaAnimals', 'jungle', 'dinosaur'],
    { name: 'animaux de la ferme', searchQuery: 'histoire animaux ferme enfant', slug: 'histoire-animaux-ferme-enfant' },
    { name: 'farm animals', searchQuery: 'farm animals bedtime story', slug: 'farm-animals-bedtime-story' }
  ),
  withDerivedSlugs(
    'seaAnimals',
    ['farmAnimals', 'forestAnimals', 'mermaid', 'pirate'],
    { name: 'animaux marins', searchQuery: 'histoire animaux marins enfant', slug: 'histoire-animaux-marins-enfant' },
    { name: 'sea animals', searchQuery: 'sea animals bedtime story', slug: 'sea-animals-bedtime-story' }
  ),
  withDerivedSlugs(
    'astronauts',
    ['space', 'robot', 'superhero', 'dinosaur'],
    { name: 'astronautes', searchQuery: 'histoire astronautes enfant', slug: 'histoire-astronautes-enfant' },
    { name: 'astronauts', searchQuery: 'astronaut bedtime story', slug: 'astronaut-bedtime-story' }
  ),
  withDerivedSlugs(
    'witches',
    ['fairy', 'dragon', 'princess', 'superhero'],
    { name: 'sorcieres gentilles', searchQuery: 'histoire sorciere gentille enfant', slug: 'histoire-sorciere-gentille-enfant' },
    { name: 'kind witches', searchQuery: 'kind witch bedtime story', slug: 'kind-witch-bedtime-story' }
  ),
  withDerivedSlugs(
    'dinosaur',
    ['dragon', 'robot', 'jungle', 'space'],
    { name: 'dinosaure', searchQuery: 'histoire du soir dinosaure', slug: 'histoire-du-soir-dinosaure' },
    { name: 'dinosaur', searchQuery: 'bedtime story dinosaur', slug: 'bedtime-story-dinosaur' }
  ),
  withDerivedSlugs(
    'princess',
    ['unicorn', 'fairy', 'knight', 'dragon'],
    { name: 'princesse', searchQuery: 'histoire du soir princesse', slug: 'histoire-du-soir-princesse' },
    { name: 'princess', searchQuery: 'bedtime story princess', slug: 'bedtime-story-princess' }
  ),
  withDerivedSlugs(
    'dragon',
    ['knight', 'princess', 'pirate', 'dinosaur'],
    { name: 'dragon', searchQuery: 'histoire dragon enfant', slug: 'histoire-dragon-enfant' },
    { name: 'dragon', searchQuery: 'dragon bedtime story', slug: 'dragon-bedtime-story' }
  ),
  withDerivedSlugs(
    'unicorn',
    ['princess', 'fairy', 'mermaid', 'superhero'],
    { name: 'licorne', searchQuery: 'histoire licorne enfant', slug: 'histoire-licorne-enfant' },
    { name: 'unicorn', searchQuery: 'unicorn bedtime story for kids', slug: 'unicorn-bedtime-story-for-kids' }
  ),
  withDerivedSlugs(
    'pirate',
    ['mermaid', 'dragon', 'knight', 'jungle'],
    { name: 'pirate', searchQuery: 'conte pirate enfant', slug: 'conte-pirate-enfant' },
    { name: 'pirate', searchQuery: 'pirate bedtime story', slug: 'pirate-bedtime-story' }
  ),
  withDerivedSlugs(
    'robot',
    ['space', 'dinosaur', 'superhero', 'dragon'],
    { name: 'robot', searchQuery: 'histoire robot enfant', slug: 'histoire-robot-enfant' },
    { name: 'robot', searchQuery: 'robot bedtime story', slug: 'robot-bedtime-story' }
  ),
  withDerivedSlugs(
    'fairy',
    ['princess', 'unicorn', 'mermaid', 'jungle'],
    { name: 'fee', searchQuery: 'conte fee enfant', slug: 'conte-fee-enfant' },
    { name: 'fairy', searchQuery: 'fairy bedtime story', slug: 'fairy-bedtime-story' }
  ),
  withDerivedSlugs(
    'knight',
    ['dragon', 'princess', 'pirate', 'superhero'],
    { name: 'chevalier', searchQuery: 'conte chevalier enfant', slug: 'conte-chevalier-enfant' },
    { name: 'knight', searchQuery: 'knight bedtime story', slug: 'knight-bedtime-story' }
  ),
  withDerivedSlugs(
    'space',
    ['robot', 'superhero', 'dinosaur', 'jungle'],
    { name: 'espace', searchQuery: 'histoire espace enfant', slug: 'histoire-espace-enfant' },
    { name: 'space', searchQuery: 'space bedtime story for kids', slug: 'space-bedtime-story-for-kids' }
  ),
  withDerivedSlugs(
    'jungle',
    ['dinosaur', 'pirate', 'fairy', 'mermaid'],
    { name: 'jungle', searchQuery: 'histoire jungle enfant', slug: 'histoire-jungle-enfant' },
    { name: 'jungle', searchQuery: 'jungle bedtime story for kids', slug: 'jungle-bedtime-story-for-kids' }
  ),
  withDerivedSlugs(
    'mermaid',
    ['pirate', 'unicorn', 'fairy', 'princess'],
    { name: 'sirene', searchQuery: 'conte sirene enfant', slug: 'conte-sirene-enfant' },
    { name: 'mermaid', searchQuery: 'mermaid bedtime story', slug: 'mermaid-bedtime-story' }
  ),
  withDerivedSlugs(
    'superhero',
    ['robot', 'space', 'knight', 'dragon'],
    { name: 'super heros', searchQuery: 'histoire super heros enfant', slug: 'histoire-super-heros-enfant' },
    { name: 'superhero', searchQuery: 'superhero bedtime story for kids', slug: 'superhero-bedtime-story-for-kids' }
  ),
];

export function normalizeProgrammaticLocale(locale: string): ProgrammaticLocale {
  if (locale === 'fr' || locale === 'en' || locale === 'es' || locale === 'de') {
    return locale;
  }
  return 'fr';
}

export function contentLocaleFromLocale(locale: string): ContentLocale {
  return locale === 'fr' ? 'fr' : 'en';
}

export function getThemeById(themeId: ThemeId): ThemeEntry | undefined {
  return STORY_THEMES.find((theme) => theme.id === themeId);
}

export function getThemeBySlug(locale: ProgrammaticLocale, slug: string): ThemeEntry | undefined {
  return STORY_THEMES.find((theme) => theme.locales[locale].slug === slug);
}

export function getThemePath(locale: ProgrammaticLocale, theme: ThemeEntry): string {
  return `/${locale}/${theme.locales[locale].slug}`;
}

export function getHubPath(locale: ProgrammaticLocale): string {
  return locale === 'fr' ? '/fr/histoires-du-soir' : `/${locale}/bedtime-stories`;
}
