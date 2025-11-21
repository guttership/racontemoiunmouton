import { NextRequest, NextResponse } from 'next/server';
import type { StoryParams } from '@/lib/gemini';
import { auth } from '@/auth';
import { checkStoryLimit } from '@/lib/story-limit';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    
    // Vérifier la limite d'histoires (sauf pour les utilisateurs premium)
    if (!session?.user?.isPremium) {
      const limitCheck = await checkStoryLimit(session?.user?.email || null);
      if (!limitCheck.canGenerate) {
        return NextResponse.json(
          { 
            error: 'Story limit reached',
            requiresPremium: true,
            daysRemaining: limitCheck.daysRemaining
          },
          { status: 403 }
        );
      }
    }
    
    const storyParams: StoryParams = {
      characters: body.characters || [],
      characterCount: body.characterCount || 1,
      environment: body.environment || '',
      locale: body.locale || 'fr',
      childName: body.childProfile?.name,
      childAge: body.childProfile?.age,
      childInterests: body.childProfile?.interests,
      childPersonality: body.childProfile?.personality,
      childFavoriteThings: body.childProfile?.favoriteThings,
    };

    if (!storyParams.characters.length || !storyParams.environment) {
      const errorMessages = {
        fr: 'Personnages et environnement requis',
        en: 'Characters and environment required',
        es: 'Se requieren personajes y entorno',
        de: 'Charaktere und Umgebung erforderlich'
      };
      return NextResponse.json(
        { error: errorMessages[storyParams.locale as keyof typeof errorMessages] || errorMessages.fr },
        { status: 400 }
      );
    }

    // Dynamic import pour éviter le chargement du SDK au build time
    const { generateStory } = await import('@/lib/gemini');
    const story = await generateStory(storyParams);
    
    return NextResponse.json({ story });
  } catch (error) {
    console.error('Erreur génération histoire:', error);
    const locale = (await request.json()).locale || 'fr';
    const errorMessages = {
      fr: 'Erreur lors de la génération de l\'histoire',
      en: 'Error generating story',
      es: 'Error al generar la historia',
      de: 'Fehler beim Generieren der Geschichte'
    };
    return NextResponse.json(
      { error: errorMessages[locale as keyof typeof errorMessages] || errorMessages.fr },
      { status: 500 }
    );
  }
}
