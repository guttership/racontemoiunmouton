import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur avec ce token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 404 }
      );
    }

    // Vérifier que le token n'est pas expiré
    if (user.tokenExpiry && user.tokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Token expiré" },
        { status: 410 }
      );
    }

    // Marquer l'email comme vérifié
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        tokenExpiry: null,
      },
    });

    // Rediriger vers la page de connexion avec un message de succès
    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/auth/signin?verified=true`);
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
