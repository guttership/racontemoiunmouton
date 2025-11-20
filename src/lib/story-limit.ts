import { prisma } from "@/lib/prisma";

/**
 * Vérifie si un utilisateur peut générer une nouvelle histoire
 * - Premium : illimité
 * - Gratuit : 1 histoire tous les 5 jours
 */
export async function checkStoryLimit(
  userId: string
): Promise<{
  canGenerate: boolean;
  reason?: string;
  daysUntilNext?: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isPremium: true,
      lastStoryDate: true,
    },
  });

  if (!user) {
    return {
      canGenerate: false,
      reason: "Utilisateur non trouvé",
    };
  }

  // Premium = illimité
  if (user.isPremium) {
    return { canGenerate: true };
  }

  // Gratuit : vérifier la limitation
  if (!user.lastStoryDate) {
    // Première histoire, toujours autorisé
    return { canGenerate: true };
  }

  const now = new Date();
  const daysSinceLastStory = Math.floor(
    (now.getTime() - user.lastStoryDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastStory >= 5) {
    return { canGenerate: true };
  }

  const daysUntilNext = 5 - daysSinceLastStory;
  return {
    canGenerate: false,
    reason: "LIMIT_REACHED",
    daysUntilNext,
  };
}

/**
 * Met à jour la date de dernière génération d'histoire
 */
export async function updateLastStoryDate(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastStoryDate: new Date(),
      storiesGenerated: { increment: 1 },
    },
  });
}

/**
 * Sauvegarde une histoire dans la base de données
 */
export async function saveStory(data: {
  userId: string;
  characters: string;
  setting: string;
  number: number;
  locale: string;
  title?: string;
  content: string;
  audioUrl?: string;
}): Promise<void> {
  await prisma.story.create({
    data,
  });

  // Mettre à jour la date de dernière génération
  await updateLastStoryDate(data.userId);
}

/**
 * Récupère les histoires d'un utilisateur
 */
export async function getUserStories(userId: string, limit = 10) {
  return prisma.story.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      characters: true,
      setting: true,
      number: true,
      locale: true,
      title: true,
      content: true,
      audioUrl: true,
      createdAt: true,
    },
  });
}
