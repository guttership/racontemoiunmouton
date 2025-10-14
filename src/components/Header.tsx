'use client';

import ThemeToggle from '@/components/ThemeToggle';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function Header() {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <ThemeToggle />
      <LocaleSwitcher />
    </div>
  );
}
