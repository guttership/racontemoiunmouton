import { getTranslations } from "next-intl/server";
import { PremiumBanner } from "@/components/PremiumBanner";
import { Crown } from "lucide-react";
import { ModernBackground } from "@/components/illustrations/OrganicShapes";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Premium" });

  return {
    title: t("title"),
    description: t("upgradeToPremium"),
  };
}

export default async function PremiumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Premium" });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#313231] relative transition-colors duration-300">
      <ModernBackground />
      
      <div className="relative max-w-5xl mx-auto px-4 py-12 z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <Image 
              src="/logo_mouton.svg" 
              alt="Logo" 
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-courgette text-[#ff7519] mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-200 font-clash-grotesk max-w-2xl mx-auto">
            {t("upgradeToPremium")}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <PremiumBanner />
        </div>
      </div>
    </div>
  );
}
