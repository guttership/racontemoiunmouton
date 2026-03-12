import { ContentLocale, ThemeEntry, ThemeId, getThemeById } from './theme-dataset';

type FaqItem = {
  question: string;
  answer: string;
};

type ThemeCopyVariant = {
  frUniverse: string;
  frSleepBenefit: string;
  frMiniMission: string;
  frMoodWord: string;
  enUniverse: string;
  enSleepBenefit: string;
  enMiniMission: string;
  enMoodWord: string;
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

const THEME_VARIANTS: Record<ThemeId, ThemeCopyVariant> = {
  forestAnimals: {
    frUniverse: 'une grande foret calme ou les animaux parlent a voix basse',
    frSleepBenefit: 'apaiser le rythme du soir avec des images de nature',
    frMiniMission: 'retrouver le gland porte-bonheur de la chouette',
    frMoodWord: 'naturel',
    enUniverse: 'a quiet forest where animals speak softly',
    enSleepBenefit: 'slow down bedtime with nature-based imagery',
    enMiniMission: 'find the owl\'s lucky acorn',
    enMoodWord: 'grounded',
  },
  farmAnimals: {
    frUniverse: 'une ferme douce au coucher du soleil avec grange lumineuse',
    frSleepBenefit: 'creer une routine simple et repetitive rassurante',
    frMiniMission: 'aider le petit veau a retrouver sa couverture',
    frMoodWord: 'chaleureux',
    enUniverse: 'a gentle sunset farm with a warm glowing barn',
    enSleepBenefit: 'build a simple and reassuring bedtime routine',
    enMiniMission: 'help the little calf find its blanket',
    enMoodWord: 'cozy',
  },
  seaAnimals: {
    frUniverse: 'une baie tranquille ou les animaux marins dansent lentement',
    frSleepBenefit: 'installer une respiration plus lente avant la nuit',
    frMiniMission: 'ramener une etoile de mer a son rocher prefere',
    frMoodWord: 'apaisant',
    enUniverse: 'a calm bay where sea animals move in slow rhythms',
    enSleepBenefit: 'encourage slower breathing before sleep',
    enMiniMission: 'return a starfish to its favorite rock',
    enMoodWord: 'calming',
  },
  astronauts: {
    frUniverse: 'une mission spatiale douce entre etoiles et planetes amies',
    frSleepBenefit: 'canaliser la curiosite dans un cadre rassurant',
    frMiniMission: 'recuperer un message lumineux venu de la lune',
    frMoodWord: 'fascinant',
    enUniverse: 'a gentle space mission among friendly planets',
    enSleepBenefit: 'channel curiosity inside a reassuring structure',
    enMiniMission: 'retrieve a glowing message from the moon',
    enMoodWord: 'captivating',
  },
  witches: {
    frUniverse: 'un village de sorcieres gentilles avec chaudrons de tisane',
    frSleepBenefit: 'transformer les peurs nocturnes en jeu rassurant',
    frMiniMission: 'preparer une potion de reves pour tout le quartier',
    frMoodWord: 'ludique',
    enUniverse: 'a kind witches village with cozy bedtime potions',
    enSleepBenefit: 'turn night fears into playful reassurance',
    enMiniMission: 'brew a dream potion for the whole street',
    enMoodWord: 'comforting',
  },
  dinosaur: {
    frUniverse: 'une vallee prehistorique pleine de traces geantes',
    frSleepBenefit: 'canaliser son energie avant le coucher',
    frMiniMission: 'retrouver un oeuf perdu avant la nuit',
    frMoodWord: 'aventureux',
    enUniverse: 'a prehistoric valley filled with giant footprints',
    enSleepBenefit: 'channel bedtime energy into calm curiosity',
    enMiniMission: 'find a lost egg before night falls',
    enMoodWord: 'adventurous',
  },
  princess: {
    frUniverse: 'un royaume doux entre chateau, jardin et etoiles',
    frSleepBenefit: 'renforcer confiance et douceur en fin de journee',
    frMiniMission: 'organiser un bal du soir pour remercier le village',
    frMoodWord: 'rassurant',
    enUniverse: 'a gentle kingdom of castles, gardens, and stars',
    enSleepBenefit: 'build confidence and calm before sleep',
    enMiniMission: 'prepare an evening ball to thank the village',
    enMoodWord: 'reassuring',
  },
  dragon: {
    frUniverse: 'des montagnes lumineuses surveillees par des dragons amis',
    frSleepBenefit: 'transformer les peurs en courage tranquille',
    frMiniMission: 'allumer la flamme du phare des nuages',
    frMoodWord: 'courageux',
    enUniverse: 'bright mountains watched by friendly dragons',
    enSleepBenefit: 'turn bedtime fears into quiet courage',
    enMiniMission: 'light the cloud lighthouse flame',
    enMoodWord: 'brave',
  },
  unicorn: {
    frUniverse: 'une foret pastel ou brillent des sentiers arc-en-ciel',
    frSleepBenefit: 'apaiser les emotions et encourager la tendresse',
    frMiniMission: 'reparer un pont de lumiere avant minuit',
    frMoodWord: 'poetique',
    enUniverse: 'a pastel forest crossed by rainbow paths',
    enSleepBenefit: 'soothe emotions and encourage kindness',
    enMiniMission: 'repair a bridge of light before midnight',
    enMoodWord: 'dreamy',
  },
  pirate: {
    frUniverse: 'une baie calme avec carte au tresor et bateau en bois',
    frSleepBenefit: 'poser un cadre de jeu qui finit en douceur',
    frMiniMission: 'suivre les etoiles pour retrouver une boussole doree',
    frMoodWord: 'joueur',
    enUniverse: 'a calm bay with a treasure map and wooden ship',
    enSleepBenefit: 'give active imaginations a gentle landing',
    enMiniMission: 'follow the stars to recover a golden compass',
    enMoodWord: 'playful',
  },
  robot: {
    frUniverse: 'une ville futuriste paisible aux lumieres douces',
    frSleepBenefit: 'structurer le rituel du soir avec des reperes clairs',
    frMiniMission: 'reprogrammer une luciole mecanique endormie',
    frMoodWord: 'curieux',
    enUniverse: 'a peaceful futuristic city of soft lights',
    enSleepBenefit: 'bring clear bedtime structure for curious minds',
    enMiniMission: 'reboot a sleepy mechanical firefly',
    enMoodWord: 'curious',
  },
  fairy: {
    frUniverse: 'un bois enchanté ou flottent des lanternes minuscules',
    frSleepBenefit: 'creer une transition douce vers le silence',
    frMiniMission: 'distribuer des graines de reves dans le village',
    frMoodWord: 'delicat',
    enUniverse: 'an enchanted grove full of tiny lanterns',
    enSleepBenefit: 'create a soft transition into silence',
    enMiniMission: 'deliver dream seeds across the village',
    enMoodWord: 'gentle',
  },
  knight: {
    frUniverse: 'une citadelle paisible protegee par des chevaliers bienveillants',
    frSleepBenefit: 'valoriser entraide et sentiment de securite',
    frMiniMission: 'garder la porte du matin jusqu au lever du soleil',
    frMoodWord: 'noble',
    enUniverse: 'a peaceful citadel protected by kind knights',
    enSleepBenefit: 'support safety and teamwork at bedtime',
    enMiniMission: 'guard the morning gate until sunrise',
    enMoodWord: 'steady',
  },
  space: {
    frUniverse: 'une station spatiale calme au-dessus des nuages',
    frSleepBenefit: 'ouvrir l imagination tout en gardant un cadre apaisant',
    frMiniMission: 'cartographier une etoile qui clignote faiblement',
    frMoodWord: 'contemplatif',
    enUniverse: 'a quiet space station above the clouds',
    enSleepBenefit: 'expand imagination while keeping bedtime calm',
    enMiniMission: 'map a dim blinking star',
    enMoodWord: 'wonder-filled',
  },
  jungle: {
    frUniverse: 'une jungle nocturne douce avec pluie fine et lucioles',
    frSleepBenefit: 'detendre le corps grace a des images naturelles',
    frMiniMission: 'aider un petit singe a retrouver son hamac',
    frMoodWord: 'sensoriel',
    enUniverse: 'a gentle night jungle with soft rain and fireflies',
    enSleepBenefit: 'relax the body with calming natural imagery',
    enMiniMission: 'help a little monkey find its hammock',
    enMoodWord: 'sensory',
  },
  mermaid: {
    frUniverse: 'un lagon paisible ou chantent les vagues lentes',
    frSleepBenefit: 'installer un rythme lent ideal avant de dormir',
    frMiniMission: 'ramener une perle de lune au recif',
    frMoodWord: 'fluide',
    enUniverse: 'a peaceful lagoon with slow singing waves',
    enSleepBenefit: 'set a slower rhythm before sleep',
    enMiniMission: 'return a moon pearl to the reef',
    enMoodWord: 'flowing',
  },
  superhero: {
    frUniverse: 'une ville endormie ou les heros veillent en secret',
    frSleepBenefit: 'transformer l excitation en sentiment de protection',
    frMiniMission: 'resoudre une panne de lumiere sans reveiller la ville',
    frMoodWord: 'protecteur',
    enUniverse: 'a sleepy city quietly watched by heroes',
    enSleepBenefit: 'turn excitement into a sense of safety',
    enMiniMission: 'fix a blackout without waking the city',
    enMoodWord: 'protective',
  },
};

function getFrenchIndefiniteArticle(themeName: string): 'un' | 'une' {
  const feminineThemes = new Set(['princesse', 'fee', 'sirene', 'licorne']);
  return feminineThemes.has(themeName.toLowerCase()) ? 'une' : 'un';
}

function buildFrenchIntro(themeName: string, variant: ThemeCopyVariant): string {
  return `Vous cherchez une histoire du soir sur le theme ${themeName} ? Cette page est pensee pour creer un rituel de coucher simple, utile et vraiment personnalise. Vous pouvez placer votre enfant dans ${variant.frUniverse}, choisir ses personnages preferes et adapter le ton selon son age. Le generateur produit en quelques secondes un recit unique qui aide a ${variant.frSleepBenefit}. Meme en gardant le meme theme ${themeName}, chaque generation change les details, les dialogues et la petite mission finale. Activez ensuite la narration audio pour ecouter l histoire ensemble, reduire les ecrans le soir et installer une routine ${variant.frMoodWord} et stable.`;
}

function buildEnglishIntro(themeName: string, variant: ThemeCopyVariant): string {
  return `Looking for a ${themeName} bedtime story that does not feel repetitive? This page helps you generate tailored stories in seconds, based on age, interests, and evening mood. You can place your child in ${variant.enUniverse}, select favorite characters, and tune the tone for a calmer bedtime. Our generator creates new story variations every time, which helps families build routines that stay engaging night after night. The goal is practical: ${variant.enSleepBenefit}. When needed, switch on audio narration so story time becomes a quiet shared moment at home, during travel, or right before lights out.`;
}

function buildFrenchSample(themeName: string, variant: ThemeCopyVariant): string {
  return `Ce soir-la, dans ${variant.frUniverse}, Noa recut une mission tres speciale: ${variant.frMiniMission}. Avec un pas calme, il suivit un sentier de petites lumieres, aida un ami en chemin puis trouva la solution juste avant la nuit. Tout le monde applaudit doucement pour ne pas reveiller les oiseaux. De retour sous sa couverture, Noa pensa a son aventure ${themeName}, respira lentement et ferma les yeux avec un grand sourire.`;
}

function buildEnglishSample(themeName: string, variant: ThemeCopyVariant): string {
  return `That evening, in ${variant.enUniverse}, Mia received one small mission: ${variant.enMiniMission}. She followed a line of soft lights, helped a friend along the way, and solved the challenge just before bedtime. The world grew quiet, the sky turned silver, and everyone whispered goodnight. Back under her blanket, Mia smiled, thought about her ${themeName} adventure, and drifted to sleep feeling calm and proud.`;
}

function buildFrenchFaq(themeName: string, variant: ThemeCopyVariant): FaqItem[] {
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
      question: `Ce theme ${themeName} aide-t-il vraiment au coucher ?`,
      answer: `Oui, le recit est construit pour ${variant.frSleepBenefit} et installer une transition apaisante avant le sommeil.`,
    },
    {
      question: "Peut-on ecouter l'histoire en audio ?",
      answer: "Oui, la narration audio est disponible pour transformer l'histoire en rituel d'ecoute au coucher.",
    },
  ];
}

function buildEnglishFaq(themeName: string, variant: ThemeCopyVariant): FaqItem[] {
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
      question: `Can this ${themeName} theme support calmer bedtimes?`,
      answer: `Yes. Stories are structured to ${variant.enSleepBenefit} while keeping the tone warm and age-appropriate.`,
    },
    {
      question: 'Can we listen to the story with audio narration?',
      answer: 'Yes, audio narration is available to make bedtime calm and consistent.',
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
  const variant = THEME_VARIANTS[theme.id];

  if (locale === 'fr') {
    const article = getFrenchIndefiniteArticle(localizedThemeName);

    return {
      seoTitle: `Histoire du soir ${localizedThemeName} | Conte personnalise et audio enfant`,
      metaDescription: `Creez une histoire du soir ${localizedThemeName} unique pour enfant, avec narration audio et variations adaptees a l age et au rituel du coucher.`,
      h1: `Histoire du soir avec ${article} ${localizedThemeName}`,
      heroSubtitle:
        `Generez un conte ${localizedThemeName} personnalise en quelques secondes pour un coucher plus calme et plus simple.`,
      intro: buildFrenchIntro(localizedThemeName, variant),
      sampleStory: buildFrenchSample(localizedThemeName, variant),
      howItWorksTitle: 'Comment ca marche',
      howItWorksSteps: [
        `Choisissez le theme ${localizedThemeName} et les personnages preferes de votre enfant.`,
        'Generez une histoire personnalisee en un clic avec des variantes a chaque essai.',
        "Lancez la narration audio pour terminer la routine du soir en douceur.",
      ],
      ctaLabel: 'Creer une histoire personnalisee',
      ctaHref: `/${localePrefix}`,
      relatedTitle: 'Themes similaires a explorer',
      relatedFaqTitle: 'Questions frequentes',
      relatedThemeIds: theme.related.slice(0, 4),
      faq: buildFrenchFaq(localizedThemeName, variant),
      backToHomeLabel: "Retour a l'accueil",
    };
  }

  return {
    seoTitle: `${localizedThemeName} bedtime story | Personalized and narrated for kids`,
    metaDescription: `Create a personalized ${localizedThemeName} bedtime story for kids with instant variations and optional audio narration.`,
    h1: `${localizedThemeName} bedtime story for kids`,
    heroSubtitle:
      `Generate a personalized ${localizedThemeName} bedtime story in seconds and make evenings smoother.`,
    intro: buildEnglishIntro(localizedThemeName, variant),
    sampleStory: buildEnglishSample(localizedThemeName, variant),
    howItWorksTitle: 'How it works',
    howItWorksSteps: [
      `Choose the ${localizedThemeName} theme and your child's favorite characters.`,
      'Generate an instant personalized story with fresh variations each time.',
      'Listen together with built-in audio narration to close the day calmly.',
    ],
    ctaLabel: 'Create a personalized story',
    ctaHref: `/${localePrefix}`,
    relatedTitle: 'Related bedtime themes',
    relatedFaqTitle: 'Frequently asked questions',
    relatedThemeIds: theme.related.slice(0, 4),
    faq: buildEnglishFaq(localizedThemeName, variant),
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
