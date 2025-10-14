export interface StoryPromptTranslations {
  storyFor: (name: string, age?: number) => string;
  interests: string;
  personality: string;
  favoriteThings: string;
  intro: string;
  charactersLabel: string;
  character: (count: number) => string;
  environmentLabel: string;
  guidelines: string;
  narrator: string;
  ageAdult: string;
  ageOlder: string;
}

export const storyPrompts: Record<string, StoryPromptTranslations> = {
  fr: {
    storyFor: (name: string, age?: number) => 
      `L'histoire est pour ${name}, ${age ? `${age} ans` : 'un enfant'}.`,
    interests: 'Centres d\'intérêt',
    personality: 'Personnalité',
    favoriteThings: 'Choses préférées',
    intro: 'Tu es un conteur expérimenté spécialisé dans les histoires pour enfants au coucher.\nCrée une histoire douce et apaisante avec les éléments suivants :',
    charactersLabel: 'Personnages',
    character: (count: number) => count > 1 ? 'personnages' : 'personnage',
    environmentLabel: 'Environnement',
    guidelines: `Consignes importantes :
- L'histoire doit être adaptée aux enfants, douce et rassurante
- Durée idéale : 3-5 minutes de lecture
- Fin neutre et apaisante, sans morale, ni conseil, ni développement personnel
- Langage simple et imagé
- Évite les éléments effrayants ou trop excitants
- Intègre subtilement les éléments personnels de l'enfant si fournis
- Utilise un ton chaleureux et bienveillant`,
    narrator: 'Raconte l\'histoire à la première personne comme si tu parlais directement à l\'enfant.',
    ageAdult: `Pour un adulte (plus de 15 ans) :
- Utilise un ton mature et immersif
- Structure l'histoire comme une nouvelle complète
- Vocabulaire riche et évocateur
- Fin neutre et apaisante, invitant à la détente et au sommeil`,
    ageOlder: `Utilise un vocabulaire élaboré et des phrases complexes.
Propose une aventure imaginative, avec des rebondissements.
Structure l'histoire comme un mini-roman, mais toujours rassurant.`
  },
  en: {
    storyFor: (name: string, age?: number) => 
      `This story is for ${name}, ${age ? `${age} years old` : 'a child'}.`,
    interests: 'Interests',
    personality: 'Personality',
    favoriteThings: 'Favorite things',
    intro: 'You are an experienced storyteller specializing in bedtime stories for children.\nCreate a gentle and soothing story with the following elements:',
    charactersLabel: 'Characters',
    character: (count: number) => count > 1 ? 'characters' : 'character',
    environmentLabel: 'Environment',
    guidelines: `Important guidelines:
- The story should be child-appropriate, gentle and reassuring
- Ideal duration: 3-5 minutes of reading
- Neutral and soothing ending, without morals or advice
- Simple and imaginative language
- Avoid scary or too exciting elements
- Subtly incorporate the child's personal elements if provided
- Use a warm and caring tone`,
    narrator: 'Tell the story in first person as if you were speaking directly to the child.',
    ageAdult: `For an adult (over 15 years old):
- Use a mature and immersive tone
- Structure the story as a complete short story
- Rich and evocative vocabulary
- Neutral and soothing ending, inviting relaxation and sleep`,
    ageOlder: `Use elaborate vocabulary and complex sentences.
Offer an imaginative adventure with twists.
Structure the story as a mini-novel, but always reassuring.`
  },
  es: {
    storyFor: (name: string, age?: number) => 
      `Esta historia es para ${name}, ${age ? `${age} años` : 'un niño/a'}.`,
    interests: 'Intereses',
    personality: 'Personalidad',
    favoriteThings: 'Cosas favoritas',
    intro: 'Eres un narrador experimentado especializado en cuentos para dormir.\nCrea una historia dulce y relajante con los siguientes elementos:',
    charactersLabel: 'Personajes',
    character: (count: number) => count > 1 ? 'personajes' : 'personaje',
    environmentLabel: 'Entorno',
    guidelines: `Pautas importantes:
- La historia debe ser apropiada para niños, dulce y tranquilizadora
- Duración ideal: 3-5 minutos de lectura
- Final neutral y relajante, sin moralejas ni consejos
- Lenguaje simple e imaginativo
- Evita elementos aterradores o demasiado emocionantes
- Incorpora sutilmente los elementos personales del niño si se proporcionan
- Usa un tono cálido y cariñoso`,
    narrator: 'Cuenta la historia en primera persona como si hablaras directamente con el niño.',
    ageAdult: `Para un adulto (mayor de 15 años):
- Usa un tono maduro e inmersivo
- Estructura la historia como un cuento completo
- Vocabulario rico y evocador
- Final neutral y relajante, invitando a la relajación y al sueño`,
    ageOlder: `Usa vocabulario elaborado y oraciones complejas.
Ofrece una aventura imaginativa con giros.
Estructura la historia como una mini-novela, pero siempre tranquilizadora.`
  },
  de: {
    storyFor: (name: string, age?: number) => 
      `Diese Geschichte ist für ${name}, ${age ? `${age} Jahre alt` : 'ein Kind'}.`,
    interests: 'Interessen',
    personality: 'Persönlichkeit',
    favoriteThings: 'Lieblingsdinge',
    intro: 'Du bist ein erfahrener Geschichtenerzähler für Gutenachtgeschichten.\nErstelle eine sanfte und beruhigende Geschichte mit den folgenden Elementen:',
    charactersLabel: 'Charaktere',
    character: (count: number) => count > 1 ? 'Charaktere' : 'Charakter',
    environmentLabel: 'Umgebung',
    guidelines: `Wichtige Richtlinien:
- Die Geschichte sollte kindgerecht, sanft und beruhigend sein
- Ideale Dauer: 3-5 Minuten Lesezeit
- Neutrales und beruhigendes Ende, ohne Moral oder Ratschläge
- Einfache und bildhafte Sprache
- Vermeide gruselige oder zu aufregende Elemente
- Integriere subtil die persönlichen Elemente des Kindes
- Verwende einen warmen und fürsorglichen Ton`,
    narrator: 'Erzähle die Geschichte in der ersten Person, als würdest du direkt mit dem Kind sprechen.',
    ageAdult: `Für einen Erwachsenen (über 15 Jahre):
- Verwende einen reifen und immersiven Ton
- Strukturiere die Geschichte als vollständige Kurzgeschichte
- Reichhaltiges und evokatives Vokabular
- Neutrales und beruhigendes Ende, zur Entspannung einladend`,
    ageOlder: `Verwende elaboriertes Vokabular und komplexe Sätze.
Biete ein fantasievolles Abenteuer mit Wendungen.
Strukturiere die Geschichte wie einen Mini-Roman, aber immer beruhigend.`
  }
};

export function getStoryPrompt(locale: string): StoryPromptTranslations {
  return storyPrompts[locale] || storyPrompts.fr;
}
