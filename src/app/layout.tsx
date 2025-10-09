import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://racontemoiunmouton.dmum.eu'),
  title: {
    default: "Raconte-moi un mouton - Histoires personnalisées pour enfants avec l'IA",
    template: "%s | Raconte-moi un mouton",
  },
  description:
    "Créez des histoires personnalisées pour le coucher de vos enfants avec l'IA. Choisissez les personnages, l'environnement et le nombre magique. Lecture audio incluse.",
  keywords: [
    "histoires pour enfants",
    "histoires personnalisées",
    "intelligence artificielle",
    "IA pour enfants",
    "histoires du soir",
    "conte personnalisé",
    "narration audio",
    "Google Gemini",
    "bedtime stories",
    "histoire interactive",
  ],
  authors: [{ name: "Raconte-moi un mouton" }],
  creator: "Raconte-moi un mouton",
  publisher: "Raconte-moi un mouton",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Raconte-moi un mouton - Histoires personnalisées pour enfants avec l'IA",
    description:
      "Créez des histoires personnalisées pour le coucher de vos enfants avec l'IA. Choisissez les personnages, l'environnement et le nombre magique.",
    url: "https://racontemoiunmouton.dmum.eu",
    siteName: "Raconte-moi un mouton",
    images: [
      {
        url: "/logo_mouton.svg",
        width: 400,
        height: 400,
        alt: "Logo Raconte-moi un mouton - Histoires IA pour enfants",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raconte-moi un mouton - Histoires personnalisées pour enfants avec l'IA",
    description:
      "Créez des histoires personnalisées pour le coucher de vos enfants avec l'IA. Choisissez les personnages, l'environnement et le nombre magique.",
    images: ["/logo_mouton.svg"],
    creator: "@racontemoiunmouton",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // À remplacer avec votre code Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Raconte-moi un mouton',
              description: 'Application de création d\'histoires personnalisées pour enfants avec l\'intelligence artificielle',
              url: 'https://racontemoiunmouton.dmum.eu',
              applicationCategory: 'EntertainmentApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR',
              },
              audience: {
                '@type': 'PeopleAudience',
                suggestedMinAge: 0,
                suggestedMaxAge: 12,
              },
              inLanguage: 'fr-FR',
              featureList: [
                'Création d\'histoires personnalisées',
                'Narration audio avec voix IA',
                'Choix de personnages et environnements',
                'Histoires adaptées à l\'âge de l\'enfant',
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
