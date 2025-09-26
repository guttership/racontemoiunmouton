import { NextRequest, NextResponse } from 'next/server';
import { generateStory, StoryParams } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const storyParams: StoryParams = {
      characters: body.characters || [],
      characterCount: body.characterCount || 1,
      environment: body.environment || '',
      childName: body.childProfile?.name,
      childAge: body.childProfile?.age,
      childInterests: body.childProfile?.interests,
      childPersonality: body.childProfile?.personality,
      childFavoriteThings: body.childProfile?.favoriteThings,
    };

    if (!storyParams.characters.length || !storyParams.environment) {
      return NextResponse.json(
        { error: 'Personnages et environnement requis' },
        { status: 400 }
      );
    }

    const story = await generateStory(storyParams);
    
    return NextResponse.json({ story });
  } catch (error) {
    console.error('Erreur génération histoire:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'histoire' },
      { status: 500 }
    );
  }
}
