import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer l'utilisateur avec son stripeSubscriptionId
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { stripeSubscriptionId: true },
    });

    if (!user?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "Aucun abonnement actif trouvé" },
        { status: 404 }
      );
    }

    // Annuler l'abonnement Stripe (à la fin de la période de facturation)
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({
      message: "Abonnement annulé avec succès. Il restera actif jusqu'à la fin de la période payée.",
    });
  } catch (error) {
    console.error("❌ Erreur annulation abonnement:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation de l'abonnement" },
      { status: 500 }
    );
  }
}
