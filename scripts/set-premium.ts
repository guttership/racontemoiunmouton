import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setPremium() {
  const email = 'yann.gutter@gmail.com';
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        isPremium: true,
        premiumSince: new Date(),
      },
    });
    
    console.log('✅ Utilisateur mis à jour en Premium:', user);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setPremium();
