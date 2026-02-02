import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
  });
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        {
          error: "Price ID requis",
          details: "Le frontend doit envoyer un priceId (monthly ou yearly)",
        },
        { status: 400 }
      );
    }

    // Récupérer ou créer le customer Stripe
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, stripeCustomerId: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;

    // Créer le customer Stripe s'il n'existe pas
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });

      customerId = customer.id;

      // Sauvegarder l'ID customer dans la DB
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Créer la session Stripe Checkout
    const appUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_URL ||
      "http://localhost:3000";
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/?payment=success`,
      cancel_url: `${appUrl}/?payment=cancel`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("❌ Erreur création session Stripe:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la création de la session de paiement",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
