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
        
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-MW948L3Z01"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MW948L3Z01');
            `,
          }}
        />
        
        {/* DataFast Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://datafa.st/js/script.js"
          data-website-id="dfid_83K7WzoSGbjQ5t054w2Co"
          data-domain="racontemoiunmouton.fr"
          data-allow-localhost="true"
        />
        
        {children}
      </body>
    </html>
  );
}
