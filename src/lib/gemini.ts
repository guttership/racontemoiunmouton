import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { getStoryPrompt } from './story-prompts';

// Lazy initialization pour éviter les erreurs au build time
let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;
const GEMINI_TEXT_MODEL = process.env.GOOGLE_GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

function getGeminiModel(): GenerativeModel {
  if (!model) {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not defined in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    model = genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL });
  }
  return model;
}

export interface StoryParams {
  characters: string[];
  characterCount: number;
  environment: string;
  locale: string;
  childName?: string;
  childAge?: number;
  childInterests?: string[];
  childPersonality?: string[];
  childFavoriteThings?: string[];
}

export async function generateStory(params: StoryParams): Promise<string> {
  const {
    characters,
    characterCount,
    environment,
    locale,
    childName,
    childAge,
    childInterests,
    childPersonality,
    childFavoriteThings,
  } = params;

  // Récupère les traductions du prompt selon la locale
  const p = getStoryPrompt(locale);

  const childDetails = childName ? `
${p.storyFor(childName, childAge)}
${childInterests?.length ? `${p.interests} : ${childInterests.join(', ')}.` : ''}
${childPersonality?.length ? `${p.personality} : ${childPersonality.join(', ')}.` : ''}
${childFavoriteThings?.length ? `${p.favoriteThings} : ${childFavoriteThings.join(', ')}.` : ''}
` : '';

  // Consignes d'adaptation selon l'âge
  let ageInstructions = '';
  if (childAge !== undefined && childAge !== null) {
    if (childAge > 15) {
      ageInstructions = '\n' + p.ageAdult;
    } else if (childAge > 9) {
      ageInstructions = '\n' + p.ageOlder;
    }
  }

  const prompt = `
${p.intro}

- ${p.charactersLabel} : ${characters.join(', ')} (${characterCount} ${p.character(characterCount)})
- ${p.environmentLabel} : ${environment}

${childDetails}

${p.guidelines}
${ageInstructions}

${p.narrator}
`;

  try {
    console.log(`🤖 Gemini [${locale.toUpperCase()}]: Envoi du prompt...`);
    console.log('📝 Gemini: Prompt:', prompt.substring(0, 200) + '...');
    
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const storyText = response.text();
    
    console.log('✅ Gemini: Réponse reçue, longueur:', storyText.length);
    console.log('📖 Gemini: Début:', storyText.substring(0, 100) + '...');
    
    return storyText;
  } catch (error) {
    console.error('❌ Gemini: Error generating story:', error);
    const errorMessages = {
      fr: 'Impossible de générer l\'histoire. Veuillez réessayer.',
      en: 'Unable to generate the story. Please try again.',
      es: 'No se puede generar la historia. Por favor, inténtelo de nuevo.',
      de: 'Die Geschichte kann nicht generiert werden. Bitte versuchen Sie es erneut.'
    };
    throw new Error(errorMessages[locale as keyof typeof errorMessages] || errorMessages.fr);
  }
}
