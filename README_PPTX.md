# Générateur de modèle PowerPoint - Pomme et Chou

Script Python pour créer un modèle de présentation PowerPoint respectant la charte graphique de Pomme et Chou.

## Installation

1. Installez Python 3.8 ou supérieur
2. Installez les dépendances:

```bash
pip install -r requirements_pptx.txt
```

## Préparation

1. Téléchargez le logo depuis le site www.pomme-et-chou.fr
2. Placez-le dans le même dossier que le script sous le nom:
   - `logo_couleur.png` ou
   - `logo_couleur.svg`

## Utilisation

Exécutez le script:

```bash
python create_pomme_chou_template.py
```

Le fichier `Pomme_et_Chou_Template.pptx` sera créé.

## Contenu du modèle

Le modèle contient 4 slides:

1. **Page de titre**: Fond vert avec logo et titre principal
2. **Slide standard**: En-tête vert, zone de contenu avec puces
3. **Slide deux colonnes**: Pour présenter des comparaisons ou engagements
4. **Page de fin**: Remerciements et coordonnées

## Charte graphique appliquée

- **Couleur principale**: Vert (RGB: 139, 195, 74)
- **Couleur secondaire**: Vert foncé (RGB: 76, 175, 80)
- **Accent**: Orange (RGB: 255, 152, 0)
- **Typographie**: Arial Rounded MT Bold (titres), Arial (corps de texte)

## Personnalisation

Pour modifier les couleurs, éditez le dictionnaire `COLORS` dans le script.

Pour changer les polices, modifiez les variables `FONT_TITLE` et `FONT_BODY`.

## Coordonnées de l'entreprise

Zone d'activités, 1 rue Saint Ulrich
67390 Marckolsheim
www.pomme-et-chou.fr

## Note

Le script fonctionne sans logo, mais le rendu sera meilleur avec le logo officiel.
