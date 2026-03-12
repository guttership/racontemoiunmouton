import { ContentLocale, ThemeEntry, ThemeId, getThemeById } from './theme-dataset';

type FaqItem = {
  question: string;
  answer: string;
};

export type GeneratedSeoContent = {
  seoTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  intro: string;
  sampleStory: string;
  howItWorksTitle: string;
  howItWorksSteps: string[];
  ctaLabel: string;
  ctaHref: string;
  relatedTitle: string;
  relatedFaqTitle: string;
  relatedThemeIds: ThemeId[];
  faq: FaqItem[];
  backToHomeLabel: string;
};

function getFrenchIndefiniteArticle(themeName: string): 'un' | 'une' {
  const feminineThemes = new Set(['princesse', 'fee', 'sirene', 'licorne']);
  return feminineThemes.has(themeName.toLowerCase()) ? 'une' : 'un';
}

function buildFrenchIntro(themeName: string): string {
  return `Vous cherchez une histoire du soir autour du theme ${themeName} pour apaiser le coucher de votre enfant ? Cette page vous aide a creer en quelques secondes un conte unique, adapte a son age, a ses envies et a son humeur du soir. Avec notre generateur d'histoires personnalisees, vous choisissez un univers, ajoutez des personnages, puis lancez la generation instantanee d'un recit doux et rassurant. Chaque histoire peut etre differente, meme avec le meme theme ${themeName}, pour renouveler le rituel du coucher sans effort. Vous pouvez aussi activer la narration audio afin d'ecouter l'histoire ensemble, a la maison ou en deplacement.`;
}

function buildEnglishIntro(themeName: string): string {
  return `Looking for a ${themeName} bedtime story that feels fresh every night? This page helps you create a custom story in seconds, based on your child's age, interests, and evening mood. Our AI story generator lets you pick a theme, combine characters, and instantly produce a calm and engaging bedtime tale. Even with the same ${themeName} topic, each story can be different, so bedtime routines stay magical instead of repetitive. When you are ready, you can also enable audio narration to listen together and turn story time into a relaxing moment at home, during travel, or right before sleep.`;
}

function buildFrenchSample(themeName: string): string {
  return `Ce soir-la, dans la vallee des ${themeName}, Luna decouvrit une petite lumiere doree cachee sous une feuille geante. En la touchant, elle entendit une voix douce: "Chaque enfant courageux peut inventer son propre chemin." Avec un sourire, Luna suivit la lumiere, aida un ami en difficulte et rentra sous les etoiles, fiere et rassuree. Dans son lit, elle ferma les yeux en murmurant: "Demain, j'inventerai encore une nouvelle aventure."`;
}

function buildEnglishSample(themeName: string): string {
  return `That evening, in the land of ${themeName}, Leo found a tiny golden light resting beside a quiet path. As soon as he touched it, a gentle voice whispered, "Brave hearts can always create a new adventure." Leo followed the glow, helped a friend cross a sleepy river, and returned home under a sky full of stars. Wrapped in his blanket, he smiled and said, "Tomorrow, we will tell an even better story."`;
}

function buildFrenchFaq(themeName: string): FaqItem[] {
  return [
    {
      question: `Peut-on creer une histoire personnalisee avec le theme ${themeName} ?`,
      answer: `Oui. Vous choisissez le theme ${themeName}, ajoutez des personnages et lancez la generation pour obtenir une histoire unique.`,
    },
    {
      question: 'Est-ce adapte pour les enfants de 4 a 8 ans ?',
      answer: "Oui, les histoires sont pensees pour etre accessibles aux jeunes enfants et peuvent etre adaptees selon l'age.",
    },
    {
      question: "Peut-on ecouter l'histoire en audio ?",
      answer: "Oui, la narration audio est disponible pour transformer l'histoire en rituel d'ecoute au coucher.",
    },
    {
      question: 'Peut-on regenerer une histoire plusieurs fois ?',
      answer: 'Oui, vous pouvez relancer la generation pour obtenir de nouvelles variations autour du meme theme.',
    },
  ];
}

function buildEnglishFaq(themeName: string): FaqItem[] {
  return [
    {
      question: `Can I create a personalized ${themeName} bedtime story?`,
      answer: `Yes. Choose the ${themeName} theme, add characters, and generate a unique story in seconds.`,
    },
    {
      question: 'Is it suitable for kids aged 4 to 8?',
      answer: 'Yes, stories are designed for young children and can be adapted based on age and preferences.',
    },
    {
      question: 'Can we listen to the story with audio narration?',
      answer: 'Yes, audio narration is available to make bedtime calm and consistent.',
    },
    {
      question: 'Can I regenerate multiple versions?',
      answer: 'Yes, you can generate as many variations as you need for fresh bedtime moments.',
    },
  ];
}

export function generateThemeSeoContent(input: {
  locale: ContentLocale;
  localePrefix: string;
  theme: ThemeEntry;
}): GeneratedSeoContent {
  const { locale, localePrefix, theme } = input;
  const localizedThemeName = theme.locales[locale].name;

  if (locale === 'fr') {
    const article = getFrenchIndefiniteArticle(localizedThemeName);

    return {
      seoTitle: `Histoire du soir ${localizedThemeName} | Histoires personnalisees pour enfant`,
      metaDescription: `Creez une histoire du soir ${localizedThemeName} unique avec narration audio. Personnalisez les personnages, le theme et le ton en quelques clics.`,
      h1: `Histoire du soir avec ${article} ${localizedThemeName}`,
      heroSubtitle:
        'Generez une histoire personnalisee en quelques secondes et transformez le coucher en un moment calme et creatif.',
      intro: buildFrenchIntro(localizedThemeName),
      sampleStory: buildFrenchSample(localizedThemeName),
      howItWorksTitle: 'Comment ca marche',
      howItWorksSteps: [
        'Choisissez un theme ou un personnage prefere.',
        'Generez une histoire personnalisee en un clic.',
        "Ecoutez la narration audio pour le rituel du coucher.",
      ],
      ctaLabel: 'Creer une histoire personnalisee',
      ctaHref: `/${localePrefix}`,
      relatedTitle: 'Themes similaires a explorer',
      relatedFaqTitle: 'Questions frequentes',
      relatedThemeIds: theme.related.slice(0, 4),
      faq: buildFrenchFaq(localizedThemeName),
      backToHomeLabel: "Retour a l'accueil",
    };
  }

  return {
    seoTitle: `${localizedThemeName} bedtime story | Personalized stories for kids`,
    metaDescription: `Create a personalized ${localizedThemeName} bedtime story with instant generation and audio narration for children.`,
    h1: `${localizedThemeName} bedtime story for kids`,
    heroSubtitle:
      'Generate a unique bedtime story in seconds and make your evening routine calmer, warmer, and more playful.',
    intro: buildEnglishIntro(localizedThemeName),
    sampleStory: buildEnglishSample(localizedThemeName),
    howItWorksTitle: 'How it works',
    howItWorksSteps: [
      'Choose a theme or favorite character.',
      'Generate a personalized bedtime story instantly.',
      'Listen together with built-in audio narration.',
    ],
    ctaLabel: 'Create a personalized story',
    ctaHref: `/${localePrefix}`,
    relatedTitle: 'Related bedtime themes',
    relatedFaqTitle: 'Frequently asked questions',
    relatedThemeIds: theme.related.slice(0, 4),
    faq: buildEnglishFaq(localizedThemeName),
    backToHomeLabel: 'Back to home',
  };
}

export function generateHubContent(locale: ContentLocale) {
  if (locale === 'fr') {
    return {
      title: 'Histoires du soir par theme',
      subtitle:
        "Explorez des pages d'idees par univers pour creer rapidement une histoire personnalisee avec narration audio.",
      intro:
        "Cette page hub regroupe nos themes les plus recherches pour les histoires du soir: dinosaure, princesse, pirate, licorne et bien d'autres. Chaque page vous donne un exemple de conte, des questions frequentes et un acces direct au generateur.",
      ctaLabel: 'Creer une histoire personnalisee',
      ctaHref: '/fr',
      faqTitle: 'Questions frequentes',
      faq: [
        {
          question: 'Comment choisir le meilleur theme pour le coucher ?',
          answer: "Choisissez un univers qui rassure et amuse votre enfant, puis adaptez les personnages a ses envies du moment.",
        },
        {
          question: 'Les histoires sont-elles toutes differentes ?',
          answer: 'Oui, la generation cree des variantes pour renouveler le rituel chaque soir.',
        },
        {
          question: "Peut-on ecouter les histoires en audio ?",
          answer: "Oui, vous pouvez activer la narration audio pour une lecture mains libres.",
        },
      ],
      cardTitlePrefix: 'Histoire',
      homeLabel: "Retour a l'accueil",
    };
  }

  return {
    title: 'Bedtime stories by theme',
    subtitle:
      'Browse high-intent theme pages to quickly create personalized bedtime stories with optional audio narration.',
    intro:
      'This hub groups our most popular bedtime story topics, including dinosaur, princess, pirate, unicorn, and more. Each landing page includes a short sample, practical FAQs, and a direct link to the generator.',
    ctaLabel: 'Create a personalized story',
    ctaHref: '/en',
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        question: 'How do I pick the best bedtime story theme?',
        answer: "Start with your child's current interests, then personalize characters and tone for a smoother bedtime routine.",
      },
      {
        question: 'Can I generate different stories for the same theme?',
        answer: 'Yes, each generation can produce new variations so bedtime never feels repetitive.',
      },
      {
        question: 'Is audio narration included?',
        answer: 'Yes, you can listen to generated stories with built-in narration.',
      },
    ],
    cardTitlePrefix: 'Story',
    homeLabel: 'Back to home',
  };
}

export function getRelatedThemes(locale: 'fr' | 'en' | 'es' | 'de', relatedIds: ThemeId[]) {
  return relatedIds
    .map((id) => getThemeById(id))
    .filter((theme): theme is ThemeEntry => Boolean(theme))
    .map((theme) => ({
      id: theme.id,
      name: theme.locales[locale].name,
      slug: theme.locales[locale].slug,
      query: theme.locales[locale].searchQuery,
    }));
}
