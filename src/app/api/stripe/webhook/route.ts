import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
  });
}

// Désactiver le body parser de Next.js pour les webhooks Stripe
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("❌ Erreur webhook Stripe:", err);
    return NextResponse.json({ error: "Webhook invalide" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Filtre pour ignorer les événements des autres projets
        const isMyProjectEvent = 
          session.success_url?.includes("racontemoiunmouton.fr") ||
          session.success_url?.includes("tellmeasheep.com") ||
          session.cancel_url?.includes("racontemoiunmouton.fr") ||
          session.cancel_url?.includes("tellmeasheep.com");

        if (!isMyProjectEvent) {
          console.log("[WEBHOOK] Ignoring event from other project");
          return NextResponse.json({ received: true });
        }
        
        const userId = session.metadata?.userId;

        if (userId && session.customer) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              isPremium: true,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              premiumSince: new Date(),
            },
          });
          console.log(`✅ Utilisateur ${userId} est maintenant Premium`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          const isActive =
            subscription.status === "active" ||
            subscription.status === "trialing";

          await prisma.user.update({
            where: { id: user.id },
            data: {
              isPremium: isActive,
              stripeSubscriptionId: subscription.id,
            },
          });
          console.log(
            `✅ Abonnement ${subscription.id} mis à jour: ${isActive ? "actif" : "inactif"}`
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isPremium: false,
              stripeSubscriptionId: null,
            },
          });
          console.log(`✅ Abonnement ${subscription.id} annulé`);
        }
        break;
      }

      default:
        console.log(`⚠️ Type d'événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Erreur traitement webhook:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
