import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Texte requis' }, { status: 400 });
    }

    // Fonction de nettoyage (copie de celle dans googleStoryTeller)
    const cleanTextForSpeech = (inputText: string): string => {
      return inputText
        // Supprimer les astérisques et leurs contenus (actions/descriptions)
        .replace(/\*[^*]*\*/g, '')
        // Supprimer les caractères de formatage markdown
        .replace(/[*_#`~]/g, '')
        // Remplacer les guillemets par des espaces ou du contexte
        .replace(/["""''«»]/g, ' ')
        // Supprimer les crochets et leur contenu (annotations)
        .replace(/\[[^\]]*\]/g, '')
        // Supprimer les parenthèses avec annotations
        .replace(/\([^)]*\)/g, '')
        // Nettoyer les tirets multiples
        .replace(/--+/g, ' ')
        // Supprimer les caractères spéciaux problématiques
        .replace(/[§©®™±×÷]/g, '')
        // Nettoyer les espaces multiples
        .replace(/\s+/g, ' ')
        // Supprimer les espaces en début/fin
        .trim();
    };

    const originalText = text;
    const cleanedText = cleanTextForSpeech(text);

    return NextResponse.json({
      original: originalText,
      cleaned: cleanedText,
      charactersRemoved: originalText.length - cleanedText.length,
      improvements: [
        'Astérisques (*texte*) supprimés',
        'Guillemets remplacés par des espaces',
        'Caractères markdown nettoyés',
        'Annotations [texte] supprimées',
        'Parenthèses (texte) supprimées',
        'Caractères spéciaux problématiques supprimés',
        'Espaces multiples normalisés'
      ]
    });

  } catch (error) {
    console.error('Erreur nettoyage:', error);
    return NextResponse.json(
      { error: 'Erreur lors du nettoyage' },
      { status: 500 }
    );
  }
}