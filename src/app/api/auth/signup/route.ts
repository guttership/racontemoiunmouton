import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email" },
        { status: 409 }
      );
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un token de vérification
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        verificationToken,
        tokenExpiry,
      },
    });

    // TODO: Envoyer l'email de vérification
    // Pour l'instant, on retourne le token (à retirer en production)
    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verificationUrl = `${appUrl}/api/auth/verify-email?token=${verificationToken}`;

    return NextResponse.json({
      message: "Compte créé avec succès. Vérifie ton email pour activer ton compte.",
      userId: user.id,
      // En dev seulement :
      verificationUrl: process.env.NODE_ENV === "development" ? verificationUrl : undefined,
    });
  } catch (error) {
    console.error("Erreur lors de la création du compte:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}
