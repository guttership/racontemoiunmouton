import { NextRequest, NextResponse } from 'next/server';
import type { StoryParams } from '@/lib/gemini';
import { auth } from '@/auth';
import { checkStoryLimit, checkAnonymousStoryLimit, saveStory, recordAnonymousGeneration } from '@/lib/story-limit';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    
    // Vérifier la limite d'histoires
    if (session?.user) {
      // Utilisateur connecté
      if (!session.user.isPremium) {
        const limitCheck = await checkStoryLimit(session.user.id);
        if (!limitCheck.canGenerate) {
          return NextResponse.json(
            { 
              error: 'Story limit reached',
              requiresPremium: true,
              daysUntilNext: limitCheck.daysUntilNext
            },
            { status: 403 }
          );
        }
      }
    } else {
      // Utilisateur anonyme - limite de 1 tous les 5 jours
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown';
      
      const limitCheck = await checkAnonymousStoryLimit(ip);
      if (!limitCheck.canGenerate) {
        return NextResponse.json(
          { 
            error: 'Anonymous limit reached',
            requiresAccount: true,
            daysUntilNext: limitCheck.daysUntilNext
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
    
    // Enregistrer la génération pour tracking des limites
    if (session?.user) {
      // Utilisateur connecté : sauvegarder l'histoire complète
      await saveStory({
        userId: session.user.id,
        characters: storyParams.characters.join(', '),
        setting: storyParams.environment,
        number: storyParams.characterCount,
        locale: storyParams.locale,
        content: story,
      });
    } else {
      // Anonyme : juste enregistrer l'IP et la date
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown';
      await recordAnonymousGeneration(ip);
    }
    
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
