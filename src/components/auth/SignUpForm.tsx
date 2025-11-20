"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Loader2, CheckCircle } from "lucide-react";

export function SignUpForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("errorOccurred"));
        return;
      }

      setSuccess(true);
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push(`/${locale}/auth/signin`);
      }, 3000);
    } catch (err) {
      setError(t("errorOccurred"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                {t("accountCreated")}
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                {t("verifyEmailMessage")}
              </p>
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400">
            {t("redirecting")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            {t("name")}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={t("namePlaceholder")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            {t("email")}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={t("emailPlaceholder")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            {t("password")}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={t("passwordPlaceholder")}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("passwordMinLength")}
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("loading")}
            </>
          ) : (
            t("signUp")
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t("alreadyAccount")}{" "}
        <Link
          href={`/${locale}/auth/signin`}
          className="text-[#ff7519] hover:text-[#e66610] font-medium font-clash-grotesk"
        >
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
