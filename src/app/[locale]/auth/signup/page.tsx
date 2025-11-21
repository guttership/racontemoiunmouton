import { getTranslations } from "next-intl/server";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ModernBackground } from "@/components/illustrations/OrganicShapes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  return {
    title: t("signUp"),
    description: t("signUpDescription"),
  };
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#313231] relative transition-colors duration-300">
      <ModernBackground />
      
      <div className="relative z-10 flex items-center justify-center px-4 py-12 min-h-screen">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-[#2a2a29] rounded-3xl p-8 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-courgette text-gray-900 dark:text-white mb-2">
                {t("signUp")}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-clash-grotesk">
                {t("signUpSubtitle")}
              </p>
            </div>

            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
