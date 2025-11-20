import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setFree() {
  const email = 'yann.gutter@gmail.com';
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        isPremium: false,
        premiumSince: null,
        lastStoryDate: null,
        storiesGenerated: 0,
      },
    });
    
    console.log('✅ Utilisateur remis en mode gratuit:', user);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setFree();
