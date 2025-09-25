import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-6 mt-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <Link href="/mentions-legales" className="text-sm text-gray-500 hover:text-[#ff7519] underline">
            Mentions légales
          </Link>
          <a href="https://dmum.eu" target="_blank" rel="noopener" aria-label="dmum.eu" className="ml-2 flex items-center">
            <img src="/logo_mouton.svg" alt="Logo dmum.eu" style={{ width: 28, height: 28, filter: 'grayscale(1)', opacity: 0.7 }} className="inline align-middle" />
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://www.linkedin.com/in/yann-gutter-9192337a/" target="_blank" rel="noopener" aria-label="LinkedIn" className="hover:text-[#ff7519]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-[#ff7519]">
              <rect x="2" y="2" width="20" height="20" rx="4" fill="none" />
              <path d="M8 11v5" />
              <path d="M8 8v.01" />
              <path d="M12 16v-5" />
              <path d="M16 16v-3a2 2 0 0 0-4 0" />
            </svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61571889646567" target="_blank" rel="noopener" aria-label="Facebook" className="hover:text-[#ff7519]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-[#ff7519]">
              <rect x="2" y="2" width="20" height="20" rx="4" fill="none" />
              <path d="M16 8h-2a2 2 0 0 0-2 2v2h4" />
              <path d="M12 16v-4" />
            </svg>
          </a>
        </div>
        <div className="text-xs text-gray-400 text-center md:text-right">
          &copy; {new Date().getFullYear()} Yann Gutter
        </div>
      </div>
    </footer>
  );
}
