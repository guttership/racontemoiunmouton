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
  title: "Raconte-moi un mouton - Histoires créatives pour enfants",
  description: "Créez des histoires personnalisées pour enfants selon leurs goûts et votre imagination ! L'IA s'occupe du reste. Application Next.js, rapide et créative.",
  openGraph: {
    title: "Raconte-moi un mouton - Histoires créatives pour enfants",
    description: "Créez des histoires personnalisées pour enfants selon leurs goûts et votre imagination ! L'IA s'occupe du reste.",
    url: "https://racontemoiunmouton.vercel.app/",
    siteName: "Raconte-moi un mouton",
    images: [
      {
        url: "/logo_mouton.svg",
        width: 400,
        height: 400,
        alt: "Logo Raconte-moi un mouton",
      }
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raconte-moi un mouton - Histoires créatives pour enfants",
    description: "Créez des histoires personnalisées pour enfants selon leurs goûts et votre imagination ! L'IA s'occupe du reste.",
    images: ["/logo_mouton.svg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  title: "Raconte-moi un mouton - Histoires créatives pour enfants",
  description: "Créez des histoires personnalisées pour enfants selon leurs goûts et votre imagination ! L'IA s'occupe du reste. Application Next.js, rapide et créative.",
  openGraph: {
    title: "Raconte-moi un mouton - Histoires créatives pour enfants",
    description: "Créez des histoires personnalisées pour enfants selon leurs goûts et votre imagination ! L'IA s'occupe du reste.",
    url: "https://racontemoiunmouton.vercel.app/",
    siteName: "Raconte-moi un mouton",
    images: [
      {
        url: "/logo_mouton.svg",
        width: 400,
        height: 400,
        alt: "Logo Raconte-moi un mouton",
      }
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raconte-moi un mouton - Histoires créatives pour enfants",
    description: "Créez des histoires personnalisées pour enfants selon leurs goûts et votre imagination ! L'IA s'occupe du reste.",
    images: ["/logo_mouton.svg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
