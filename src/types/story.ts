export interface StorySettings {
  characters: string[];
  characterCount: number;
  environment: string;
  childProfile?: ChildProfile;
}

export interface ChildProfile {
  name?: string;
  age?: number;
  interests?: string[];
  personality?: string[];
  favoriteThings?: string[];
}

export interface StoryGenerationRequest extends StorySettings {
  childProfile?: ChildProfile;
}

export const CHARACTER_OPTIONS = [
  'Animaux de la forêt',
  'Animaux de la ferme', 
  'Animaux marins',
  'Dragons magiques',
  'Fées et elfes',
  'Astronautes',
  'Pirates gentils',
  'Princesses et princes',
  'Robots amicaux',
  'Sorcières bienveillantes',
  'Super-héros',
  'Dinosaures',
];

export const ENVIRONMENT_OPTIONS = [
  'Forêt enchantée',
  'Jardin fleuri',
  'Plage au coucher du soleil',
  'Montagne enneigée',
  'Prairie colorée',
  'Château magique',
  'Vaisseau spatial',
  'Île tropicale',
  'Village de cottages',
  'Grotte aux cristaux',
  'Ferme à la campagne',
  'Royaume sous-marin',
];

export const INTERESTS_OPTIONS = [
  'Animaux',
  'Musique',
  'Dessin',
  'Sport',
  'Danse',
  'Cuisine',
  'Jardinage',
  'Lecture',
  'Jeux vidéo',
  'Construction/Lego',
  'Aventure',
  'Magie',
  'Science',
  'Voitures',
  'Avions',
  'Dinosaures',
];

export const PERSONALITY_OPTIONS = [
  'Curieux/Curieuse',
  'Courageux/Courageuse',
  'Timide',
  'Drôle',
  'Bienveillant(e)',
  'Créatif/Créative',
  'Énergique',
  'Calme',
  'Rêveur/Rêveuse',
  'Déterminé(e)',
];
