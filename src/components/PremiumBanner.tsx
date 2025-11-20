"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

export function PremiumBanner() {
  const { data: session } = useSession();
  const t = useTranslations("Premium");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly"
  );

  const handleUpgrade = async () => {
    // 1. Vérification côté client : utilisateur connecté ?
    if (!session?.user) {
      // Sauvegarder le plan sélectionné dans sessionStorage
      sessionStorage.setItem("pendingPremiumPlan", selectedPlan);
      router.push("/auth/signin?returnUrl=/&premium=true");
      return;
    }

    setLoading(true);

    try {
      const priceId =
        selectedPlan === "monthly"
          ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
          : process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY;

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      // Double sécurité si l'API renvoie 401
      if (response.status === 401) {
        sessionStorage.setItem("pendingPremiumPlan", selectedPlan);
        router.push("/auth/signin?returnUrl=/&premium=true");
        return;
      }

      const data = await response.json();

      if (data.url) {
        // Nettoyer le sessionStorage avant de rediriger
        sessionStorage.removeItem("pendingPremiumPlan");
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erreur lors de l'upgrade:", error);
    } finally {
      setLoading(false);
    }
  };

  // Si l'utilisateur est déjà premium
  if (session?.user?.isPremium) {
    return (
      <div className="bg-white dark:bg-[#2a2a29] rounded-3xl p-8 text-center">
        <Crown className="h-12 w-12 text-[#ff7519] mx-auto mb-4" />
        <p className="text-2xl font-courgette text-[#ff7519]">{t("premiumPlan")}</p>
        <p className="text-gray-700 dark:text-gray-200 mt-2">{t("premiumFeature1")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Sélecteur de plan - Simple */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedPlan("monthly")}
          className={`bg-white dark:bg-[#2a2a29] rounded-3xl p-8 transition-all ${
            selectedPlan === "monthly"
              ? "ring-2 ring-[#ff7519] shadow-lg"
              : "hover:shadow-md"
          }`}
        >
          <p className="text-xl font-clash-grotesk font-semibold text-gray-900 dark:text-white mb-2">
            {t("monthly")}
          </p>
          <p className="text-4xl font-courgette text-[#ff7519] mb-1">
            2,99€
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {t("perMonth")}
          </p>
        </button>

        <button
          onClick={() => setSelectedPlan("yearly")}
          className={`bg-white dark:bg-[#2a2a29] rounded-3xl p-8 transition-all relative ${
            selectedPlan === "yearly"
              ? "ring-2 ring-[#ff7519] shadow-lg"
              : "hover:shadow-md"
          }`}
        >
          <div className="absolute -top-2 -right-2 bg-[#ff7519] text-white text-xs font-clash-grotesk px-3 py-1 rounded-full">
            -16%
          </div>
          <p className="text-xl font-clash-grotesk font-semibold text-gray-900 dark:text-white mb-2">
            {t("yearly")}
          </p>
          <p className="text-4xl font-courgette text-[#ff7519] mb-1">
            29,90€
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {t("perYear")}
          </p>
        </button>
      </div>

      {/* Fonctionnalités - Simple */}
      <div className="bg-white dark:bg-[#2a2a29] rounded-3xl p-8">
        <p className="text-2xl font-courgette text-[#ff7519] mb-6 text-center">
          {t("title")}
        </p>
        <div className="space-y-3 text-gray-700 dark:text-gray-200 font-clash-grotesk">
          <p>• {t("premiumFeature1")}</p>
          <p>• {t("premiumFeature2")}</p>
          <p>• {t("premiumFeature3")}</p>
          <p>• {t("premiumFeature4")}</p>
        </div>
      </div>

      {/* Bouton */}
      <Button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full bg-[#ff7519] hover:bg-[#e66610] text-white font-clash-grotesk py-6 text-lg rounded-2xl"
      >
        {loading ? (
          <span className="animate-pulse">{t("loading")}</span>
        ) : (
          <>
            <Crown className="mr-2 h-5 w-5" />
            {t("upgrade")}
          </>
        )}
      </Button>
    </div>
  );
}
