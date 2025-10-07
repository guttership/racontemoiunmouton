import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export interface StoryParams {
  characters: string[];
  characterCount: number;
  environment: string;
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
    childName,
    childAge,
    childInterests,
    childPersonality,
    childFavoriteThings,
  } = params;

  const childDetails = childName ? `
L'histoire est pour ${childName}, ${childAge ? `${childAge} ans` : 'un enfant'}.
${childInterests?.length ? `Centres d'intérêt : ${childInterests.join(', ')}.` : ''}
${childPersonality?.length ? `Personnalité : ${childPersonality.join(', ')}.` : ''}
${childFavoriteThings?.length ? `Choses préférées : ${childFavoriteThings.join(', ')}.` : ''}
` : '';

  // Consignes d'adaptation selon l'âge
  let ageInstructions = '';
  if (childAge !== undefined && childAge !== null) {
    if (childAge <= 3) {
      ageInstructions = `
`;
    } else if (childAge <= 6) {
      ageInstructions = `
`;
    } else if (childAge <= 9) {
      ageInstructions = `
`;
    } else if (childAge > 15) {
      ageInstructions = `
Pour un adulte (plus de 15 ans) :
- Utilise un ton mature et immersif.
- Structure l'histoire comme une nouvelle complète : introduction, développement, conclusion.
- Vocabulaire riche et évocateur.
- Propose une aventure ou une expérience narrative adaptée à un public adulte, sans morale, ni conseil, ni développement personnel.
- La fin doit être neutre et apaisante, invitant simplement à la détente et au sommeil, sans message éducatif ou philosophique.
`;
    } else {
      ageInstructions = `
Utilise un vocabulaire élaboré et des phrases complexes.
Propose une aventure imaginative, avec des rebondissements adaptés à l'âge.
Mets l'accent sur l'autonomie, la réflexion et l'émotion positive.
Structure l'histoire comme un mini-roman, mais toujours rassurant et adapté au coucher.
`;
    }
  }

  const prompt = `
Tu es un conteur expérimenté spécialisé dans les histoires pour enfants au coucher.
Crée une histoire douce et apaisante avec les éléments suivants :

- Personnages : ${characters.join(', ')} (${characterCount} personnage${characterCount > 1 ? 's' : ''})
- Environnement : ${environment}

${childDetails}

Consignes importantes :
- L'histoire doit être adaptée aux enfants, douce et rassurante
- Durée idéale : 3-5 minutes de lecture
- Fin neutre et apaisante, sans morale, ni conseil, ni développement personnel. La conclusion doit simplement inviter à la détente et au sommeil, sans message éducatif ou philosophique.
- Langage simple et imagé
- Évite les éléments effrayants ou trop excitants
- Intègre subtilement les éléments personnels de l'enfant si fournis
- Utilise un ton chaleureux et bienveillant
${ageInstructions}
Raconte l'histoire à la première personne comme si tu parlais directement à l'enfant.
`;

  try {
    console.log('🤖 Gemini: Envoi du prompt...');
    console.log('📝 Gemini: Prompt:', prompt.substring(0, 200) + '...');
    
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const storyText = response.text();
    
    console.log('✅ Gemini: Réponse reçue, longueur:', storyText.length);
    console.log('📖 Gemini: Début:', storyText.substring(0, 100) + '...');
    
    return storyText;
  } catch (error) {
    console.error('❌ Gemini: Error generating story:', error);
    throw new Error('Impossible de générer l\'histoire. Veuillez réessayer.');
  }
}
