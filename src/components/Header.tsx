'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import ThemeToggle from '@/components/ThemeToggle';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { Button } from '@/components/ui/button';
import { User, LogOut, Crown } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();
  const t = useTranslations('Auth');
  const tPremium = useTranslations('Premium');
  const locale = useLocale();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {session?.user ? (
        <>
          {/* Badge Premium si l'utilisateur est premium */}
          {session.user.isPremium && (
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ff7519] to-[#e66610] text-white text-xs font-semibold shadow-md">
              <Crown className="w-3 h-3" />
              <span>Premium</span>
            </div>
          )}
          
          {/* Bouton Devenir Premium si l'utilisateur n'est pas premium */}
          {!session.user.isPremium && (
            <Link href={`/${locale}/premium`}>
              <Button
                size="sm"
                className="rounded-full bg-gradient-to-r from-[#ff7519] to-[#e66610] hover:from-[#e66610] hover:to-[#ff7519] text-white font-clash-grotesk shadow-lg"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">{tPremium('upgrade')}</span>
              </Button>
            </Link>
          )}
          
          {/* Info utilisateur */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#2a2a29] shadow-sm">
            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-clash-grotesk">
              {session.user.name || session.user.email}
            </span>
          </div>

          {/* Bouton déconnexion */}
          <Button
            onClick={() => signOut()}
            variant="outline"
            size="sm"
            className="rounded-full bg-white dark:bg-[#2a2a29] hover:bg-gray-100 dark:hover:bg-[#3f3f3e]"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">{t('signOut')}</span>
          </Button>
        </>
      ) : (
        <>
          {/* Bouton Se connecter */}
          <Link href={`/${locale}/auth/signin`}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-white dark:bg-[#2a2a29] hover:bg-gray-100 dark:hover:bg-[#3f3f3e] font-clash-grotesk"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">{t('signIn')}</span>
            </Button>
          </Link>
        </>
      )}

      <ThemeToggle />
      <LocaleSwitcher />
    </div>
  );
}
