import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://racontemoiunmouton.dmum.eu'),
  verification: {
    google: 'your-google-verification-code', // À remplacer par votre code Google Search Console
  },
};

// Root layout minimaliste - les métadonnées sont dans [locale]/layout.tsx
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo_mouton.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo_mouton.svg" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'system';
                const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Consent Manager - Bannière cookies Google */}
        <Script
          strategy="beforeInteractive"
          src="https://cdn.consentmanager.net/delivery/autoblocking/60d005e8b2661.js"
          data-cmp-ab="1"
          data-cmp-host="d.delivery.consentmanager.net"
          data-cmp-cdn="cdn.consentmanager.net"
          data-cmp-codesrc="16"
        />
        {children}
      </body>
    </html>
  );
}
